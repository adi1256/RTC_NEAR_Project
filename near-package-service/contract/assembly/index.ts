import {
  Context,
  ContractPromise,
  ContractPromiseBatch,
  math,
  PersistentMap,
  PersistentSet,
  u128,
} from "near-sdk-as";

@nearBindgen
class Order {
  orderId: string;
  senderName: string;
  msg: string;
  address: string;
  status: string;
  payment: u128; // u128 is a 128 bit unsigned number (e.g. u32, i32)
}

// a Map is loaded into memory in full
// a PersistentMap only loads the values you ask for into memory
const orders: PersistentMap<string, Order> = new PersistentMap<
  string,
  Order
>("a");

const orderIdList: PersistentSet<string> = new PersistentSet<string>("s");

// createOrder -> place a new order
export function createOrder(accountId: string, address: string, msg: string): string {
  // create a unique(ish) id for the order
  const id = math.hash32<string>(Context.sender + accountId + msg + address).toString();

  // insert the order into the blockchain
  orders.set(id, {
    orderId: id,
    senderName: Context.sender,
    msg: msg,
    address: address,
    status: "New",
    payment: Context.attachedDeposit,
  });

  //add order is in set
  orderIdList.add(id);

  //500000000000000000000000 -> 0.5N
  //take payment from customer to packaging service account- adititest1.testnet
  ContractPromiseBatch.create("adititest1.testnet").transfer(
    Context.attachedDeposit
  );



  // return the id for the newly inserted order
  return id;
}

//get all order Ids from the list
export function getAllOrderIds(): string {
  const oids ='';
  orderIdList.values().forEach((element: string) => {
  oids.concat(element);
});


  return oids + "Total Order: " + orderIdList.size.toString()  + ". Order Ids:" + orderIdList.values().toString();
}


// getOrder -> view order
export function getOrder(id: string): Order {
  assert(orders.contains(id), "No order for that id exists");

  return orders.getSome(id);
}

// closeorder -> pay the delivery person when they finished the order correctly
export function closeorder(id: string, status: string): void {
  assert(orders.contains(id), "No order with that id exists");
  const order = orders.getSome(id);

  assert(Context.sender == order.orderId, "You are not allowed");

  order.status = "Complete";
  ContractPromiseBatch.create(order.senderName).transfer(
    order.payment
  );

  orders.set(id, order);
  //orders.delete(id);
}
