const near = new nearApi.Near({
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
});
const wallet = new nearApi.WalletConnection(near, "assign-a-friend");

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

//get order is list
//view function does not change state, it will get all the Ids of orders 
//placed
window.onload = async () => {

  const orderIdElement = document.getElementById("orderids");
  const orderIds = await wallet
    .account()
    .viewFunction("dev-1627747103314-12926545171909", "getAllOrderIds");
  orderIdElement.textContent = orderIds;
};

//get the elements by Ids to set the value for order
const orderIdElement = document.getElementById("order-id");
const senderIdElement = document.getElementById("sender-id");
const addressElement = document.getElementById("text");
const messageElement = document.getElementById("msg");
const orderStatusElement = document.getElementById("status");
const amountElement = document.getElementById("amount");


//get order details 
const form1 = document.getElementById("view-form-order");

form1.addEventListener("submit", (event) => {

  event.preventDefault();

  const fd = new FormData(event.target);

  //await wallet
  const order = wallet
    .account()
    .viewFunction(
      {
        contractId: "dev-1627747103314-12926545171909",
        methodName: "getOrder",
        args: { id: document.getElementById("order-id").value },
      });



  if (order == null || order != null) {
    orderIdElement.textContent = "NULL" + order;// order.orderId;

  }
  //set the content according to the order details fetched
  orderIdElement.textContent = order.orderId;
  senderIdElement.textContent = order.senderName;
  addressElement.textContent = order.address;
  messageElement.textContent = order.msg;
  orderStatusElement.textContent = order.status;
  amountElement.textContent = order.payment;
});

//complete order-> closeorder
const form = document.getElementById("complete-order");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fd = new FormData(event.target);

  wallet.account().functionCall({
    contractId: "dev-1627747103314-12926545171909",
    methodName: "closeorder",
    args: { id: orderId, answer: fd.get("answer") },
  });
});
