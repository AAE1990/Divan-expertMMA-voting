import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVotingDto {
  @IsString()
  @IsNotEmpty()
  pollId!: string;

  @IsString()
  @IsNotEmpty()
  optionId!: string;
}
