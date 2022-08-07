function check(accepted,user) {
    let friends = document.querySelector("#Friends");
    if (accepted === "notsent") {
      friends.innerHTML = "Add to Friends?";
      friends.href = `/friends/${user}/send`;
    } else if (accepted === "accepted") {
      friends.innerHTML = "Unfriend?";
      friends.href = `/friends/${user}/remove`;
    } else if (accepted === 0) {
      friends.innerHTML = "Sent a request";
    } else if (accepted === 3) {
      friends.innerHTML = "Accept request?";
      friends.href = `/friends/${user}/accept`;
    }
  }

document.addEventListener("DOMContentLoaded", () => {
  const request = new XMLHttpRequest();
  var pathArray = window.location.pathname.split("/");
  var user = pathArray[2];
  request.open("POST", `/friends/${user}/check`);
  request.onload = () => {
    const val = JSON.parse(request.responseText);
    let get = val[0].friend;
    check(get,user);
  };
  const request1 = new XMLHttpRequest();
  request1.open("POST", `/friends/${user}/connections`);
  request1.onload = () => {
    const cnx = JSON.parse(request1.responseText);
    let num = cnx[0].level;
    document.querySelector("#level").innerHTML = num;
  };
  const data = new FormData();
  request.send(data);
  const data1 = new FormData();
  request1.send(data1);
  return false;
});


