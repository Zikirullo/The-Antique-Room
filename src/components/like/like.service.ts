import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like_dto/like';
import { LikeInput } from '../../libs/dto/like_dto/like.input';
import { T } from '../../libs/types/common';

@Injectable()
export class LikeService {
  constructor(@InjectModel('Like') private readonly likeModel: Model<Like>) {}

  /** [{ memberId, likeRefId, myFavorite: true }] if the member liked the target, else [] */
  public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
    const { memberId, likeRefId } = input;
    const search: T = { memberId, likeRefId };
    const result = await this.likeModel.findOne(search).exec();
    return result ? [{ memberId: memberId!, likeRefId, myFavorite: true }] : [];
  }
}
