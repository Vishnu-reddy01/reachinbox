import elasticsearch from "../config/elasticsearch.js";

const EMAIL_INDEX = "emails";

export async function createEmailIndex() {
  const exists = await elasticsearch.indices.exists({ index: EMAIL_INDEX });

  if (!exists) {
    await elasticsearch.indices.create({
      index: EMAIL_INDEX,
      mappings: {
        properties: {
          id: { type: "keyword" },
          senderEmail: {
            type: "text",
            fields: { keyword: { type: "keyword", ignore_above: 256 } },
          },
          recipient: {
            type: "text",
            fields: { keyword: { type: "keyword", ignore_above: 256 } },
          },
          subject: { type: "text" },
          body: { type: "text" },
          status: { type: "keyword" },
          scheduledAt: { type: "date" },
          sentAt: { type: "date" },
          createdAt: { type: "date" },
        },
      },
    });
    console.log("Elasticsearch email index created");
  }
}

export async function indexEmail(email: {
  id: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  createdAt: Date;
}) {
  await elasticsearch.index({
    index: EMAIL_INDEX,
    id: email.id,
    document: {
      id: email.id,
      senderEmail: email.senderEmail,
      recipient: email.recipient,
      subject: email.subject,
      body: email.body,
      status: email.status,
      scheduledAt: email.scheduledAt || null,
      sentAt: email.sentAt || null,
      createdAt: email.createdAt,
    },
    refresh: "wait_for",
  });
}

export async function updateEmailIndex(id: string, data: Record<string, unknown>) {
  await elasticsearch.update({
    index: EMAIL_INDEX,
    id,
    doc: data,
    refresh: "wait_for",
  });
}

export async function deleteEmailIndex(id: string) {
  try {
    await elasticsearch.delete({ index: EMAIL_INDEX, id, refresh: "wait_for" });
  } catch (error: any) {
    if (error?.meta?.statusCode !== 404) throw error;
  }
}

export async function searchEmails(query: string, senderEmail?: string) {
  const filter: any[] = [];

  if (senderEmail) {
    filter.push({
      bool: {
        should: [
          { term: { "senderEmail.keyword": senderEmail } },
          { term: { senderEmail } },
        ],
        minimum_should_match: 1,
      },
    });
  }

  const q = query.trim().toLowerCase();
  const result = await elasticsearch.search({
    index: EMAIL_INDEX,
    query: {
      bool: {
        must: [
          {
            bool: {
              should: [
                {
                  multi_match: {
                    query: q,
                    fields: ["recipient", "subject", "body", "senderEmail"],
                    type: "best_fields",
                    operator: "or",
                  },
                },
                { wildcard: { recipient: { value: `*${q}*`, case_insensitive: true } } },
                { wildcard: { senderEmail: { value: `*${q}*`, case_insensitive: true } } },
                { wildcard: { subject: { value: `*${q}*`, case_insensitive: true } } },
                { wildcard: { body: { value: `*${q}*`, case_insensitive: true } } },
              ],
              minimum_should_match: 1,
            },
          },
        ],
        filter,
      },
    },
    sort: [{ createdAt: { order: "desc" } }],
    size: 200,
  });

  return result.hits.hits.map((hit) => hit._source);
}
