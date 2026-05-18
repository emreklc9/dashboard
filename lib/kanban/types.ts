export type Tag = { label: string; bg: string; color: string };

export type Member = { initials: string; bg: string; name?: string };

export type Comment = {
  id: number;
  text: string;
  author: string;
  initials: string;
  authorBg: string;
  time: string;
};

export type Attachment = {
  id: number;
  name: string;
  size: string;
};

export type Card = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  tags: Tag[];
  members: Member[];
  commentList: Comment[];
  attachmentList: Attachment[];
};

export type CardDetailContext = {
  card: Card;
  columnId: string;
  columnTitle: string;
  columnColor: string;
};

export type Column = {
  id: string;
  title: string;
  accentColor: string;
  cards: Card[];
};

export type NewColumnData = {
  title: string;
  accentColor: string;
};
