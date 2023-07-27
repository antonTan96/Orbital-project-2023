/**
 * An entry represents a friendship (pending or accepted) forged when User1 send the friend request to User2
 */
const friendsTable = {
    /*
        User1: str
        User2: str
    */
    name: "Friends",
    status: {pending: "Pending", accepted: "Accepted"}
};

module.exports = {friendsTable};