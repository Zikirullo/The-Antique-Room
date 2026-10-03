import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type ObjectId } from 'mongoose';
import moment from 'moment';
import { Antique, Antiques } from '../../libs/dto/antique_dto/antique';
import {
  AntiqueInput,
  AntiquesInquiry,
} from '../../libs/dto/antique_dto/antique.input';
import { AntiqueUpdate } from '../../libs/dto/antique_dto/antique.update';
import { AntiqueCategory, AntiqueStatus } from '../../libs/enums/antique.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import {
  lookupAuthMemberLiked,
  lookupMember,
  shapeIntoMongoObjectId,
} from '../../libs/config';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';

// Which details object belongs to which category
const CATEGORY_DETAILS: Record<AntiqueCategory, keyof AntiqueInput> = {
  [AntiqueCategory.FURNITURE]: 'furnitureDetails',
  [AntiqueCategory.ART]: 'artDetails',
  [AntiqueCategory.CERAMICS_PORCELAIN]: 'ceramicsPorcelainDetails',
  [AntiqueCategory.JEWELLERY_SILVERWARE]: 'jewellerySilverwareDetails',
  [AntiqueCategory.BOOKS_MAPS_DOCUMENTS]: 'booksMapsDocumentsDetails',
  [AntiqueCategory.CLOCKS_TIMEPIECES]: 'clocksTimepiecesDetails',
  [AntiqueCategory.COINS_CURRENCY_STAMPS]: 'coinsCurrenciesStampsDetails',
};

// Visible to everyone
const PUBLIC_STATUSES = [AntiqueStatus.ACTIVE, AntiqueStatus.SOLD];
// Statuses a seller may set; PENDING_AUTHENTICATION / REJECTED belong to grading
const SELLER_SETTABLE_STATUSES = [
  AntiqueStatus.DRAFT,
  AntiqueStatus.ACTIVE,
  AntiqueStatus.SOLD,
  AntiqueStatus.REMOVED,
];

@Injectable()
export class AntiqueService {
  constructor(
    @InjectModel('Antique') private readonly antiqueModel: Model<Antique>,
    private readonly memberService: MemberService,
    private readonly viewService: ViewService,
    private readonly likeService: LikeService,
  ) {}

  public async createAntique(input: AntiqueInput): Promise<Antique> {
    // Keep only the details object that matches the category
    const detailsKey = CATEGORY_DETAILS[input.antiqueCategory];
    for (const key of Object.values(CATEGORY_DETAILS)) {
      if (key !== detailsKey) delete input[key];
    }

    try {
      const result = await this.antiqueModel.create(input);
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberAntiques',
        modifier: 1,
      });
      return result;
    } catch (err: any) {
      console.log('Error, Service.model:', err.message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async getAntique(
    memberId: ObjectId | null,
    antiqueId: ObjectId,
  ): Promise<Antique> {
    // Everyone sees ACTIVE / SOLD; the owner also sees their own drafts etc.
    const search: T = memberId
      ? {
          _id: antiqueId,
          $or: [
            { antiqueStatus: { $in: PUBLIC_STATUSES } },
            { memberId, antiqueStatus: { $ne: AntiqueStatus.REMOVED } },
          ],
        }
      : { _id: antiqueId, antiqueStatus: { $in: PUBLIC_STATUSES } };

    const targetAntique: Antique | null = await this.antiqueModel
      .findOne(search)
      .lean()
      .exec();
    if (!targetAntique) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }

    if (memberId) {
      const isOwner = String(targetAntique.memberId) === String(memberId);
      if (!isOwner) {
        const viewInput = {
          memberId,
          viewRefId: antiqueId,
          viewGroup: ViewGroup.ANTIQUE,
        };
        const newView = await this.viewService.recordView(viewInput);
        if (newView) {
          await this.antiqueStatsEditor({
            _id: antiqueId,
            targetKey: 'antiqueViews',
            modifier: 1,
          });
          targetAntique.antiqueViews++;
        }
      }

      const likeInput = {
        memberId,
        likeRefId: antiqueId,
        likeGroup: LikeGroup.ANTIQUE,
      };
      targetAntique.meLiked =
        await this.likeService.checkLikeExistence(likeInput);
    }

    targetAntique.memberData = await this.memberService.getMember(
      null,
      targetAntique.memberId,
    );
    return targetAntique;
  }

  public async updateAntique(
    memberId: ObjectId,
    input: AntiqueUpdate,
  ): Promise<Antique> {
    const { antiqueStatus } = input;
    if (antiqueStatus && !SELLER_SETTABLE_STATUSES.includes(antiqueStatus)) {
      throw new ForbiddenException(Message.NOT_ALLOWED_REQUEST);
    }
    // The rating comes from the buyer, never the seller
    delete input.reviewRating;

    if (antiqueStatus === AntiqueStatus.SOLD) input.soldAt = moment().toDate();
    else if (antiqueStatus === AntiqueStatus.REMOVED) {
      input.deletedAt = moment().toDate();
    }

    // Sold or removed antiques can no longer be edited
    const search: T = {
      _id: input._id,
      memberId,
      antiqueStatus: { $nin: [AntiqueStatus.SOLD, AntiqueStatus.REMOVED] },
    };

    const result = await this.antiqueModel
      .findOneAndUpdate(search, input, { returnDocument: 'after' })
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (input.soldAt || input.deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberAntiques',
        modifier: -1,
      });
    }
    return result;
  }

  public async getAntiques(
    memberId: ObjectId | null,
    input: AntiquesInquiry,
  ): Promise<Antiques> {
    const match: T = { antiqueStatus: AntiqueStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    this.shapeMatchQuery(match, input);
    console.log('match->', match);

    const result = await this.antiqueModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupAuthMemberLiked(memberId),
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    return result[0];
  }

  public async antiqueStatsEditor(input: StatisticModifier): Promise<Antique> {
    const { _id, targetKey, modifier } = input;
    return (await this.antiqueModel
      .findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        { returnDocument: 'after' },
      )
      .exec()) as Antique;
  }

  private shapeMatchQuery(match: T, input: AntiquesInquiry): void {
    const {
      antiqueCategory,
      antiqueCondition,
      minPrice,
      maxPrice,
      memberId,
      text,
    } = input.search;

    if (antiqueCategory) match.antiqueCategory = antiqueCategory;
    if (antiqueCondition) match.antiqueCondition = antiqueCondition;
    if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
    if (minPrice !== undefined || maxPrice !== undefined) {
      match.antiquePrice = {};
      if (minPrice !== undefined) match.antiquePrice.$gte = minPrice;
      if (maxPrice !== undefined) match.antiquePrice.$lte = maxPrice;
    }
    if (text) {
      const regex = new RegExp(
        text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      );
      match.$or = [
        { antiqueEra: regex },
        { antiqueOrigin: regex },
        { antiqueDesc: regex },
      ];
    }
  }
}
