import type {
  AnnotationResponse,
  SelectColor,
  TemplateMentionResponse,
} from "./type.ts";

export type RawRichTextItemResponse =
  | RawTextRichTextItemResponse
  | RawMentionRichTextItemResponse
  | RawEquationRichTextItemResponse;

type RawTextRichTextItemResponse = {
  readonly type: "text";
  readonly text: {
    readonly content: string;
    readonly link: { readonly url: string } | null;
  };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type RawMentionRichTextItemResponse = {
  readonly type: "mention";
  readonly mention:
    | { readonly type: "user"; readonly user: PartialUserObjectResponse }
    | { readonly type: "date"; readonly date: RawDateResponse }
    | {
      readonly type: "link_preview";
      readonly link_preview: { url: string };
    }
    | {
      readonly type: "template_mention";
      readonly template_mention: TemplateMentionResponse;
    }
    | { readonly type: "page"; readonly page: { readonly id: string } }
    | { readonly type: "database"; readonly database: { readonly id: string } };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type PartialUserObjectResponse = {
  readonly id: string;
  readonly object: "user";
};

export type RawDateResponse = {
  readonly start: string;
  readonly end: string | null;
  /**
   * always null
   */
  readonly time_zone: null;
};

type RawEquationRichTextItemResponse = {
  readonly type: "equation";
  readonly equation: { readonly expression: string };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type RawPage = {
  readonly object: "page";
  readonly id: string;
  readonly created_time: string;
  readonly last_edited_time: string;
  readonly created_by: PartialUserObjectResponse;
  readonly last_edited_by: PartialUserObjectResponse;
  readonly in_trash: boolean;
  readonly properties: Record<
    string,
    RawPropertyValue
  >;

  readonly url: string;
  readonly public_url: string | null;
};

export type RawPropertyValue =
  | {
    readonly type: "number";
    readonly number: number | null;
    readonly id: string;
  }
  | {
    readonly type: "url";
    readonly url: string | null;
    readonly id: string;
  }
  | {
    readonly type: "select";
    readonly select: PartialSelectResponse | null;
    readonly id: string;
  }
  | {
    readonly type: "multi_select";
    readonly multi_select: Array<PartialSelectResponse>;
    readonly id: string;
  }
  | {
    readonly type: "status";
    readonly status: PartialSelectResponse | null;
    readonly id: string;
  }
  | {
    readonly type: "date";
    readonly date: RawDateResponse | null;
    readonly id: string;
  }
  | {
    readonly type: "email";
    readonly email: string | null;
    readonly id: string;
  }
  | {
    readonly type: "phone_number";
    readonly phone_number: string | null;
    readonly id: string;
  }
  | {
    readonly type: "checkbox";
    readonly checkbox: boolean;
    readonly id: string;
  } // | {
  //   type: "files";
  //   files: Array<
  //     | {
  //       file: { url: string; expiry_time: string };
  //       name: StringRequest;
  //       type?: "file";
  //     }
  //     | {
  //       external: { url: TextRequest };
  //       name: StringRequest;
  //       type?: "external";
  //     }
  //   >;
  //   id: string;
  // }
  // | {
  //   type: "created_by";
  //   created_by: PartialUserObjectResponse | UserObjectResponse;
  //   id: string;
  // }
  // | { type: "created_time"; created_time: string; id: string }
  // | {
  //   type: "last_edited_by";
  //   last_edited_by: PartialUserObjectResponse | UserObjectResponse;
  //   id: string;
  // }
  // | { type: "last_edited_time"; last_edited_time: string; id: string }
  // | { type: "formula"; formula: FormulaPropertyResponse; id: string }
  // | { type: "button"; button: Record<string, never>; id: string }
  // | {
  //   type: "unique_id";
  //   unique_id: { prefix: string | null; number: number | null };
  //   id: string;
  // }
  // | {
  //   type: "verification";
  //   verification:
  //     | VerificationPropertyUnverifiedResponse
  //     | null
  //     | VerificationPropertyResponse
  //     | null;
  //   id: string;
  // }
  | {
    readonly type: "title";
    readonly title: Array<RawRichTextItemResponse>;
    readonly id: string;
  }
  | {
    readonly type: "rich_text";
    readonly rich_text: Array<RawRichTextItemResponse>;
    readonly id: string;
  }
  // | {
  //   type: "people";
  //   people: Array<PartialUserObjectResponse | UserObjectResponse>;
  //   id: string;
  // }
  | {
    readonly type: "relation";
    readonly relation: ReadonlyArray<{ readonly id: string }>;
    readonly id: string;
    /**
     * https://github.com/makenotion/notion-sdk-js/issues/443#issuecomment-2092011027
     */
    readonly has_more: boolean;
  };
// | {
//   type: "rollup";
//   rollup:
//     | { type: "number"; number: number | null; function: RollupFunction }
//     | {
//       type: "date";
//       date: DateResponse | null;
//       function: RollupFunction;
//     }
//     | {
//       type: "array";
//       array: Array<
//         | { type: "number"; number: number | null }
//         | { type: "url"; url: string | null }
//         | { type: "select"; select: PartialSelectResponse | null }
//         | {
//           type: "multi_select";
//           multi_select: Array<PartialSelectResponse>;
//         }
//         | { type: "status"; status: PartialSelectResponse | null }
//         | { type: "date"; date: DateResponse | null }
//         | { type: "email"; email: string | null }
//         | { type: "phone_number"; phone_number: string | null }
//         | { type: "checkbox"; checkbox: boolean }
//         | {
//           type: "files";
//           files: Array<
//             | {
//               file: { url: string; expiry_time: string };
//               name: StringRequest;
//               type?: "file";
//             }
//             | {
//               external: { url: TextRequest };
//               name: StringRequest;
//               type?: "external";
//             }
//           >;
//         }
//         | {
//           type: "created_by";
//           created_by: PartialUserObjectResponse | UserObjectResponse;
//         }
//         | { type: "created_time"; created_time: string }
//         | {
//           type: "last_edited_by";
//           last_edited_by:
//             | PartialUserObjectResponse
//             | UserObjectResponse;
//         }
//         | { type: "last_edited_time"; last_edited_time: string }
//         | { type: "formula"; formula: FormulaPropertyResponse }
//         | { type: "button"; button: Record<string, never> }
//         | {
//           type: "unique_id";
//           unique_id: { prefix: string | null; number: number | null };
//         }
//         | {
//           type: "verification";
//           verification:
//             | VerificationPropertyUnverifiedResponse
//             | null
//             | VerificationPropertyResponse
//             | null;
//         }
//         | { type: "title"; title: Array<RichTextItemResponse> }
//         | { type: "rich_text"; rich_text: Array<RichTextItemResponse> }
//         | {
//           type: "people";
//           people: Array<
//             PartialUserObjectResponse | UserObjectResponse
//           >;
//         }
//         | { type: "relation"; relation: Array<{ id: string }> }
//       >;
//       function: RollupFunction;
//     };
//   id: string;
// }

type PartialSelectResponse = {
  readonly id: string;
  readonly color: SelectColor;
  readonly name: string;
};
