
/// This saves Matrix data
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

        
        console.log(result);

        return Response.redirect(`${url.origin}/thanks-for-reaching-out`, 301);
      } catch (err) {
        return new Response(err, { status: 400 });
      }
}

export async function onRequestGet(context) {
    const parsedUrl = new URL(context.request.url)
    const key = parsedUrl.pathname.replace(/^\/+/, '') // strip any preceding /'s
    if(!key){
      return new Response('Missing path in URL', {
          status: 400
      })
    }

    const data = await context.env.rfWeb.get('69', 'json');

    return Response.json(data);
}
