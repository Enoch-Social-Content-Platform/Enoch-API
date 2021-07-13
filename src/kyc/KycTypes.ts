import { Field, InputType } from "type-graphql";

export enum IDTYPE {
  IDCard = "ID_CARD",
  PASSPORT = "PASSPORT",
  DRIVING = "DRIVING_LICENCE",
  SELFIE = "SELFIE",
  PROOFADDRESS = "PROOF_ADRESSE",
}

@InputType()
export class Inputkyc {
  @Field()
  ID_type: IDTYPE;

  @Field()
  ID_number: Number;

  @Field()
  expiration_date: Date;
}
