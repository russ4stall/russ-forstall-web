export async function onRequestGet(context) {
    const saveId = context.params.saveId;
    
    if(!saveId){
      return new Response('Missing path in URL', {
          status: 400
      })
    }

    const data = await context.env.rfWeb.get(`matrix:${saveId}`, 'json');

    return Response.json(data);
}