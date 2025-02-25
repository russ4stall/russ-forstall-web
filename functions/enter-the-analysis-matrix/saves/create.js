export async function onRequestPost(context) {
    const secondsFromNow = 7776000; // 90 days

    const data = await context.request.json();
    console.log(data);
    const saveId = data.saveId;
    if(!saveId){
      return new Response('Missing path in URL', {
          status: 400
      })
    }

    await context.env.rfWeb.put(`matrix:${saveId}`, JSON.stringify(data), {expirationTtl: secondsFromNow});

    return new Response(saveId, { status: 200 });
}