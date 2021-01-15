import { onReceive, send } from './Message';

onReceive('query', async (content: { likerID: string , postURL: string }) => {
    const selfLikesRequest: Promise<{ liker: string, count: number, isSubscribed: boolean, isTrialSubscriber: boolean}> = fetch(`https://like.co/api/like/likebutton/${content.likerID}/self?referrer=${content.postURL}`).then(res => res.json());
    const totalLikesRequest: Promise<{ total: number, totalLiker: number}> = fetch(`https://like.co/api/like/likebutton/${content.likerID}/total?referrer=${content.postURL}`).then(res => res.json());
    const superLikeRequest: Promise<{ isSuperLiker: boolean, canSuperLike: boolean, nextSuperLikeTs: number, lastSuperLikeInfos: Array<any> }> = fetch(`https://like.co/api/like/share/self?referrer=${content.postURL}`).then(res => res.json())

    Promise.all([selfLikesRequest, totalLikesRequest, superLikeRequest]).then(([selfLikes, totalLikes, superLike]) => {
        send(`query:${content.postURL}`, {
            postURL: content.postURL,
            selfLikes: selfLikes.count,
            totalLikes: totalLikes.total,
            superLike
        });
    })
    .catch(error => {
        console.error(error);
    });
});

onReceive('like', (content: { likerID: string, postURL: string }) => {
    fetch(`https://like.co/api/like/likebutton/${content.likerID}/like?referrer=${content.postURL}&cookie_support=0`, { method: 'POST' })
    .then(res => res.text())
    .then(data => {
        if (data == 'OK') send(`like:${content.postURL}`, { success: true });
    });
});