import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [friendList, setFriendList] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleToggle() {
    setIsFormOpen((prev) => !prev);
  }

  function handleNewFriend(newFriend) {
    setFriendList((prev) => [...prev, newFriend]);
    setIsFormOpen(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((prev) => (prev?.id === friend.id ? null : friend));
    setIsFormOpen(false);
  }

  function handleBilSubmit(value) {
    console.log(value);

    setFriendList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {isFormOpen && <FormAddFriend onAdd={handleNewFriend} />}

        <Button OnClick={handleToggle}>
          {isFormOpen ? "close" : "Add Friends"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSubmit={handleBilSubmit}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((item) => (
        <Friend
          key={item.id}
          friend={item}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button OnClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAdd }) {
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");

  function onSubmit(e) {
    e.preventDefault();
    if (!friendName || !imageUrl) return;

    const id = crypto.randomUUID();

    const friend = {
      id,
      name: friendName,
      image: `${imageUrl}?=${id}`,
      balance: 0,
    };
    onAdd(friend);
    setFriendName("");
    setImageUrl("https://i.pravatar.cc/48");
  }

  return (
    <form onSubmit={onSubmit} className="form-add-friend">
      <label for="friend_name">🍟 Friend's Name</label>
      <input
        type="text"
        id="friend_name"
        onChange={(e) => setFriendName(e.target.value)}
        value={friendName}
      />

      <label for="image">📷 Image URL</label>
      <input
        type="text"
        onChange={(e) => setImageUrl(e.target.value)}
        value={imageUrl}
      />

      <Button>Add</Button>
    </form>
  );
}

function Button({ children, OnClick }) {
  return (
    <button className="button" onClick={OnClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ selectedFriend, onSubmit }) {
  const [totalBils, setTotalBils] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidbyFriend = totalBils ? totalBils - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!totalBils || !paidByUser) return;
    onSubmit(whoIsPaying === "user" ? paidbyFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Splite a bill with {selectedFriend.name}</h2>
      <label for="bil_value">💰 Bil Value</label>
      <input
        type="text"
        id="bil_value"
        value={totalBils}
        onChange={(e) => setTotalBils(Number(e.target.value))}
      />

      <label for="your_bill">🧑 Your bill</label>
      <input
        type="text"
        id="your_bill"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > totalBils
              ? paidByUser
              : Number(e.target.value)
          )
        }
      />

      <label for="friend_bill">🧛‍♂️ {selectedFriend.name} bill</label>
      <input type="text" id="friend_bill" disabled value={paidbyFriend} />

      <label for="friend_bill">🤑 Who is paying?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bills</Button>
    </form>
  );
}
