export enum PollStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FINISHED = 'FINISHED', // когда уже начислены баллы
}

export interface IVoteOption {
  id: string;
  textRu: string; // Имя бойца на русском
  textEn: string; // Имя бойца на английском
  photoUrl?: string; // URL-адрес фотографии бойца
  votesCount: number; // общее кол-во голосов для прогресс-бара
}

export interface IPoll {
  id: string;
  question: string; // "Кто победит в этом бою?"
  options: IVoteOption[];
  status: PollStatus;
  createdAt: string;
  expiresAt: string; // время закрытия голосования
  userVoteOptionId?: string | null; // ID выбора пользователя
  winnerOptionId?: string | null; // ID победившего варианта (заполняется при закрытии)
  isPeopleChamp?: boolean; // Флаг "Народный чемпион"
  tournamentId?: string | null; // ID турнира (может отсутствовать)
  questionRu: string; // Вопрос на русском
  questionEn: string; // Вопрос на английском
}

export interface IVoteInput {
  pollId: string;
  optionId: string;
}

// Для страницы рейтинга
export interface IUserRating {
  userId: string;
  username: string;
  score: number; // накопленные баллы
  rank: number; // место в топе
}