import { Schema } from 'mongoose';
import {
  MemberAuth,
  MemberStatus,
  MemberType,
  VerificationStatus,
} from '../libs/enums/member.enum';

const ExpertProfileSchema = new Schema(
  {
    // specialties: {
    //   type: [String],
    //   enum: AntiqueCategory,
    //   required: true,
    // },

    credentialsDesc: {
      type: String,
      required: true,
    },
    credentialsImages: {
      type: [String],
    },
    yearsOfExperience: {
      type: Number,
    },
    verificationStatus: {
      type: String,
      enum: VerificationStatus,
      default: VerificationStatus.PENDING,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  { _id: false },
);

const MemberSchema = new Schema(
  {
    expertProfile: {
      type: ExpertProfileSchema,
    },

    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.COLLECTOR,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberAuth: {
      type: String,
      enum: MemberAuth,
      default: MemberAuth.PHONE,
    },

    memberPhone: {
      type: String,
      unique: true,
      sparse: true,
    },

    memberPassword: {
      type: String,
      select: false,
    },

    memberEmail: {
      type: String,
      unique: true,
      sparse: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    appleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    telegramId: {
      type: String,
      unique: true,
      sparse: true,
    },

    memberNick: {
      type: String,
      required: true,
      unique: true,
    },

    memberDesc: {
      type: String,
    },

    memberImage: {
      type: String,
    },

    memberAddress: {
      type: String,
    },

    memberAntiques: {
      type: Number,
      default: 0,
    },

    memberRank: {
      type: Number,
      default: 0,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },

    memberFollowers: {
      type: Number,
      default: 0,
    },

    memberFollowings: {
      type: Number,
      default: 0,
    },

    memberViews: {
      type: Number,
      default: 0,
    },

    memberLikes: {
      type: Number,
      default: 0,
    },

    memberComments: {
      type: Number,
      default: 0,
    },

    memberWarnings: {
      type: Number,
      default: 0,
    },

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default MemberSchema;
