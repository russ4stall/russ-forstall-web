/// This processes the contact form on the home page.
export async function onRequestPost(context) {
    try {
        const url = new URL(context.request.url);
        const body = await context.request.formData();

        const reqBody = {
          fields: {
            Subject: body.get('whats-up'),
            Message: body.get('something-good')
          },
        };

        const result = await createAirtableRecord(context.env, reqBody);
        
        console.log(result);

        return Response.redirect(`${url.origin}/thanks-for-reaching-out`, 301);
      } catch (err) {
        return new Response(err, { status: 400 });
      }
}

async function createAirtableRecord(env, reqBody) {
  try {
    const result = fetch(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`,
      {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}