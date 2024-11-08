import { StatusDto } from "../../dto/StatusDto";
import { VerifiedRequest } from "./VerifiedRequest";

export interface PostStatusRequest extends VerifiedRequest{
  readonly newStatus: StatusDto
}

const x: PostStatusRequest = {

  token: "str",
  newStatus: {
    post: "str",
    user: {
      firstName: "str",
      lastName: "str",
      alias: "str",
      imageUrl: "str"
    },
    timestamp: 1
  }
}