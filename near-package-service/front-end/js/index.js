const near = new nearApi.Near({
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
});
const wallet = new nearApi.WalletConnection(near, "near-package-service");

//checking sign-in status
window.onload = async () => {
  const signinElement = document.getElementById("check-sign-in");
  const accountIdElement = document.getElementById("accountId");

  signinElement.textContent = "Not Signed-In, Please sign-in!";
  if (wallet.isSignedIn()) {
    signinElement.textContent = "You are Signed-In!";
    accountIdElement.textContent = " Welcome!";
  }
  else {
    signinElement.textContent = "Not Signed-In, Please sign-in!";
  }

};

//sign-into the wallet functioning
const button = document.getElementById("sign-in");

button.addEventListener("click", () => {
  wallet.requestSignIn({
    contractId: "dev-1627747103314-12926545171909",
  });
  //document.location.href = 'sendPackage.html';
});


//sign-out of the wallet functioning
const buttonSignOut = document.getElementById("sign-out");

buttonSignOut.addEventListener("click", () => {
  wallet.signOut();
});


//view order
const buttonViewOrder = document.getElementById("view-order");

buttonViewOrder.addEventListener("click", () => {

});

//create-order
const form = document.getElementById("assignment-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fd = new FormData(event.target);
  const orderNewId = document.getElementById("orderNewid");
  const oid = wallet.account().functionCall({
    contractId: "dev-1627747103314-12926545171909",
    methodName: "createOrder",
    args: {
      accountId: fd.get("accountId"),
      address: fd.get("address"),
      msg: fd.get("msg"),

    },
    attachedDeposit: fd.get("amount"),
  });

  orderNewId.textContent("Your order iD:" + oid);
  //alert("Order Placed Successfully!");
});


/*
// creates a new account using funds from the account used to create it
const account = await near.account("adititest.testnet");
await account.createAccount(
  "newer1.testnet", // new account name
  "8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc", // public key for new account
  "10000000000000000000" // initial balance for new account in yoctoNEAR
);*/