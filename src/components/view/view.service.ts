import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { View } from '../../libs/dto/view_dto/view';
import { ViewInput } from '../../libs/dto/view_dto/view.input';
import { T } from '../../libs/types/common';

@Injectable()
export class ViewService {
  constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

  /** Records a view once per member per target. Returns null if already viewed. */
  public async recordView(input: ViewInput): Promise<View | null> {
    const viewExist = await this.checkViewExistence(input);
    if (viewExist) return null;

    console.log(' - New view inserted - ');
    return await this.viewModel.create(input);
  }

  private async checkViewExistence(input: ViewInput): Promise<View | null> {
    const { memberId, viewRefId } = input;
    const search: T = { memberId, viewRefId };
    return await this.viewModel.findOne(search).exec();
  }
}
