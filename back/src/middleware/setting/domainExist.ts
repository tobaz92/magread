// import UserModel from "../../models/users";
import { Request, Response, NextFunction } from "express";

import { AuthenticatedRequest, HttpError } from "../../types/auth";

const domainExist = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const domainUser = req.body?.domain || {};
    const domainDocument = req.embedToken || {};

    if (!domainUser || !domainDocument) {
      return next(
        Object.assign(new Error("Domain not found") as HttpError, {
          status: 200,
        })
      );
    }

    const domainUserProtocol = domainUser?.protocol;

    if (!domainUserProtocol) {
      return next(
        Object.assign(
          new Error("Domain user protocol not found") as HttpError,
          {
            status: 400,
          }
        )
      );
    }

    const domainDocumentDomain = domainDocument?.domain;

    if (!domainDocumentDomain) {
      return next(
        Object.assign(
          new Error("Domain document domain not found") as HttpError,
          {
            status: 400,
          }
        )
      );
    }

    const domainDocumentProtocol = domainDocumentDomain.split(":")[0] + ":";

    if (!domainDocumentProtocol) {
      return next(
        Object.assign(
          new Error("Domain document protocol not found") as HttpError,
          {
            status: 400,
          }
        )
      );
    }

    if (domainUserProtocol !== domainDocumentProtocol) {
      return next(
        Object.assign(
          new Error(
            "This protocole domain is not allowed for this documents"
          ) as HttpError,
          {
            status: 400,
          }
        )
      );
    }

    const domainUserDomain = domainUser?.domain;
    const domainDocumentDomainName = domainDocumentDomain.split("/")[2];

    if (domainUserDomain !== domainDocumentDomainName) {
      return next(
        Object.assign(
          new Error("Document is not allowed on this domain") as HttpError,
          {
            status: 400,
          }
        )
      );
    }

    const hrefUser = domainUser?.href.split("/")[2].split(":")[0];

    if (hrefUser !== domainUserDomain) {
      return next(
        Object.assign(
          new Error("Domain user and href are different") as HttpError,
          {
            status: 400,
          }
        )
      );
    }

    next();
  } catch (error: any) {
    return next(
      Object.assign(new Error(`Server error: ${error.message}`) as HttpError, {
        status: 500,
      })
    );
  }
};

export default domainExist;
