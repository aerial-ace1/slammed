
document.addEventListener('DOMContentLoaded',()=>{

    const request = new XMLHttpRequest();
    var pathArray = window.location.pathname.split('/');
    var user = pathArray[2];
    request.open('POST',`/friends/${user}/check`);
    request.onload = () => {
        const val = JSON.parse(request.responseText)
        let accepted = val[0].friend;
        let friends = document.querySelector("#Friends")
        if (accepted === "notsent"){
            friends.innerHTML="Add to Friends?"
            friends.href=`/friends/${user}/send`
        }
        else if (accepted === "accepted") {
            friends.innerHTML="Unfriend?"
            friends.href=`/friends/${user}/remove`
        } 
        else if (accepted === 0) {
            friends.innerHTML="Sent a request"
        }
        else if (accepted === 3) {
            friends.innerHTML="Accept request?"
            friends.href=`/friends/${user}/accept`
        }
    }
    const data = new FormData();
    request.send(data);
    return false;
})

