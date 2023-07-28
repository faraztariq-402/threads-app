import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore,addDoc, collection,query, orderBy,where, getDocs,getDoc,setDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyDxXGuWuxo9HjRzlCBO8w7WlqGa5GIObn0",
  authDomain: "threads-clone-29286.firebaseapp.com",
  projectId: "threads-clone-29286",
  storageBucket: "threads-clone-29286.appspot.com",
  messagingSenderId: "763972461983",
  appId: "1:763972461983:web:c1668ea87ac2468b1d89aa",
  measurementId: "G-4DHB611MR3"
};


var audio = new Audio("audio.mp3");

audio.oncanplaythrough = function(){
// audio.play();
}

audio.loop = true;

audio.onended = function(){

}

{/* <img width="60" height="60" src="https://img.icons8.com/ios-glyphs/60/paper-plane.png" alt="paper-plane"/> */}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let cancelButton = document.getElementById("cancelButton");
let threadsIcon = document.querySelector(".threadsIcon")
let myHome = document.getElementById("myHome");
let myPost = document.getElementById("post");
myPost.style.color = "gray"

let myUser = document.getElementById("myUser");
myUser.style.color = "gray"

let postContainer = document.getElementById("postContainer");
let createPost = document.getElementById("createPost");
let post = document.querySelector('.post');
let user = document.querySelector('.user');
let userPara = document.querySelector('#userPara');
let home = document.querySelector('.home');
let userLabel = document.querySelector('#userLabel');
let currentUser;
let createPostContainer = document.getElementById("createPostConatiner")

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (currentUser) {
    if (currentUser.email) {
      console.log("Current user email:", currentUser.email);
    } else {
      console.log("Email not available");
    }

    if (user) {
      console.log("User is signed in");
    } else {
      console.log("User is signed out");
      window.location.href = "../login/index.html";
    }
  }
});

const usersCollection = collection(db, "users");

home.addEventListener("click", () => {
 myPost.style.color = "gray"
 myUser.style.color = "gray"
 myHome.style.color = "black"

 createPostContainer.style.display = "none"
  postContainer.style.display = 'block';
threadsIcon.style.display = "block"
  userDiv.style.display = 'none';

});

user.addEventListener("click", () => {
  myHome.style.color = "gray"
 myPost.style.color = "gray"
 myUser.style.color = "black"

  postContainer.style.display = 'none';
createPostContainer.style.display = "none"
  userDiv.style.display = 'block';
  userDiv.innerHTML = `Current User: ${currentUser.email}`;
});

 
  post.addEventListener('click', async () => {
    myHome.style.color = "gray"
    myUser.style.color = "gray"
    myPost.style.color = "black"
   createPostContainer.style.display = "block"
   createPostContainer.innerHTML = ""
   userDiv.style.display = "none"
   threadsIcon.style.display = "none"
    postContainer.style.display = "none"
   
    let headerContainer = document.createElement("div");
    headerContainer.classList.add("headerContainer");
    
    createPostContainer.appendChild(headerContainer);
    
    let cancelContainer = document.createElement("div"); // Create a container for the "Cancel" link
    cancelContainer.classList.add("cancelContainer"); // You can add any additional styling here if needed
    
    let cancel = document.createElement("a");
    cancel.classList.add("cancel");
    cancel.innerHTML = "Cancel";
    
    let headerOfCreatingPostContainer = document.createElement("div"); // Create a container for the <h1> element
    headerOfCreatingPostContainer.classList.add("headerOfCreatingPostContainer"); // You can add any additional styling here if needed
    
    let headerOfCreatingPost = document.createElement("h4");
    headerOfCreatingPost.classList.add("postHeader");
    headerOfCreatingPost.textContent = "New Thread";
    
    let horizontalLine = document.createElement("hr");
    horizontalLine.classList.add("horizontalLine")
    let profileAndLabel = document.createElement("div")
    profileAndLabel.classList.add("profileAndLabel")
    let userProfile = document.createElement("div")
    userProfile.style.height = "2.4rem"
    userProfile.style.width = "2.4rem"
    userProfile.style.border = "2px solid gray"

    userProfile.style.borderRadius = "50%"

    let labelAndInput = document.createElement("div")
    labelAndInput.classList.add("labelAndInput")
    let creatingPostLabel = document.createElement("label")
    creatingPostLabel.textContent = currentUser.email
    creatingPostLabel.style.display = "block"
    let input = document.createElement("textarea");
    input.id = "postInput";
    input.placeholder = "Start a thread...";
    let paraAndPostButton = document.createElement("div")
    paraAndPostButton.classList.add("paraAndPostButton")
    let para = document.createElement("p")
    para.classList.add("para")
    para.textContent = "Anyone can reply"
    let postButton = document.createElement("a");
    postButton.classList.add("postButton")
    postButton.textContent = "Post";
    
    cancelContainer.appendChild(cancel); // Add "Cancel" link to its container
    headerOfCreatingPostContainer.appendChild(headerOfCreatingPost); // Add <h1> element to its container
    
    headerContainer.appendChild(cancelContainer); // Add the "Cancel" container to the headerContainer
    headerContainer.appendChild(headerOfCreatingPostContainer); // Add the <h1> container to the headerContainer
    
    createPostContainer.appendChild(horizontalLine);
    createPostContainer.appendChild(profileAndLabel)
    profileAndLabel.appendChild(userProfile)
    profileAndLabel.appendChild(labelAndInput)
    labelAndInput.appendChild(creatingPostLabel)
    labelAndInput.appendChild(input);
    createPostContainer.appendChild(paraAndPostButton)
    paraAndPostButton.appendChild(para)
    paraAndPostButton.appendChild(postButton);
 
    // Append the elements to the container or form where you want the new post input to appear
    // For example, you can append them to a form with the id "postForm":
    cancel.addEventListener("click", ()=>{
      createPostContainer.style.display = "none"
      postContainer.style.display = "block"
      threadsIcon.style.display = "block"
      myHome.style.color = "black"
      myUser.style.color = "gray"
      myPost.style.color = "gray"

    })
  
    postButton.addEventListener('click', async () => {
    
      try {
        const postInput = input.value;
        createPostContainer.style.display = "none"
        postContainer.style.display = "block"
        const postCollection = collection(db, 'posts');
        await addDoc(postCollection, {
          post: postInput,
          userId: currentUser.uid,
          timestamp: new Date(), // Add the timestamp field with the current date and time
          currentUser: currentUser.email,
          likes: 0,
          replies: 0,
        });
    threadsIcon.style.display = "block"
      myHome.style.color = "black"
      myUser.style.color = "gray"
      myPost.style.color = "gray"
        // Clear the input field after posting
        input.value = '';
  
        // Refresh the posts data after adding a new post
        getDataFromFirestore();
  
        console.log("Data added to Firestore successfully");
      } catch (error) {
        console.error('Error adding document:', error);
      }
    });
  });
   
  
  
const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
  getDataFromFirestore();
  alert('Post deleted successfully!');
}

// post.addEventListener('click', () => {


// });


const getDataFromFirestore = async () => {
  
  const querySnapshot = await getDocs(query(collection(db, 'posts'), orderBy('timestamp', 'desc')));
  postContainer.innerHTML = '';
  querySnapshot.forEach(async (snapshot) => {
    const docId = snapshot.id;
    const data = snapshot.data();
    const postRef = doc(db, "posts", docId);

    const userDoc = await getDoc(doc(usersCollection, data.userId)); // Fetch the user document using userId
let grandParent = document.createElement("div")
grandParent.classList.add("grandParent")

    let div = document.createElement('div');
    
    let parentProfile = document.createElement("div")
parentProfile.classList.add("parentProfile")

    let profile = document.createElement("div")
    profile.classList.add("myProfile")
    let myHr = document.createElement("hr")
    myHr.classList.add("myHr")
    
    let commentProfiles = document.createElement("div")
    commentProfiles.classList.add("myProfile")
    postContainer.appendChild(grandParent)
    grandParent.appendChild(parentProfile)
    grandParent.appendChild(div)
    parentProfile.appendChild(profile)
    parentProfile.appendChild(myHr)
    parentProfile.appendChild(commentProfiles)

let labelAndDeletePostSpan = document.createElement("div")
labelAndDeletePostSpan.classList.add("labelAndDeletePostSpan")
div.appendChild(labelAndDeletePostSpan)
let labelDiv = document.createElement("div")
    let myLabel = document.createElement('label');
    myLabel.classList.add('myLabel')
    myLabel.textContent = data.currentUser;
    myLabel.textContent= myLabel.textContent.replace(/@gmail\.com$/, "")
    labelAndDeletePostSpan.appendChild(labelDiv)
    labelDiv.appendChild(myLabel);

    let hr = document.createElement('hr');
    hr.classList.add("hr");
    let para = document.createElement('p');
    let timeAndDeletePostDiv = document.createElement('div')
    timeAndDeletePostDiv.classList.add("timeAndDeletePostDiv")
    // timeAndDeletePostDiv.textContent = "ff"
    let span = document.createElement("span");
    span.classList.add('timeSpan');
    span.textContent = getPostTime(data.timestamp); // Pass the timestamp field to getPostTime
    para.innerHTML = data.post;
    para.classList.add('myPara');
    div.classList.add('myDiv');
   let myIcon = document.createElement("div")
myIcon.classList.add("myIcon")
    labelAndDeletePostSpan.appendChild(timeAndDeletePostDiv)
     div.appendChild(para);
div.appendChild(myIcon)
async function addLikeToCollection(postRef, userId) {
  const likesCollection = collection(db, 'likes');
  await addDoc(likesCollection, {
    postId: postRef.id,
    userId: userId,
  });
}

// Function to remove a like from the "likes" collection
async function removeLikeFromCollection(postRef, userId) {
  const likesQuerySnapshot = await getDocs(query(collection(db, 'likes'), where('postRef', '==', postRef), where('userId', '==', userId)));
  
  // Check if the user has already liked the post
  if (!likesQuerySnapshot.empty) {
    const likeDoc = likesQuerySnapshot.docs[0];
    await deleteDoc(likeDoc.ref);
  }
}
async function checkIfLiked(postRef, userId) {
  const likesQuerySnapshot = await getDocs(query(collection(db, 'likes'), where('postRef', '==', postRef), where('userId', '==', userId)));
  // like.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACKUlEQVR4nO2YPWsUURSGH/ADLNSAYKFWoo0Iohs12b1nRjSg2GurdvoPxEpLC0WxtfEvGIt0SrRQC2MaQTSChaJZ1A0W0cK8MpOA+xHdubuTnbsyLxwYhplzn/eeM5e5F0qVKlWqVKmMUoTJuCljRo5PMn7JmJfxWMY1xezJkGNv+uzyO/NpjuVcMzJuqIYjb8lRkfFIhrpEYuiextnekaPKZjnurjzTLc9DGYfygr8gx48MgzbHB1UZbYIflTHnlcOlY57rH94PvBngm2ocUMRBORo95zHO9wYfcVjGzz4GTuKt98zbKpVwVPwNGE/6hM8vHNN+8DWOFQ5tHRFlN+C4EwCw2qpwy6d9ZgsHto6Y8THwJcAK1H1aaDFAA4s+FXgfoIF3PhV4UDiwdcSkj4FLAQCrLS5mN3CELTK+BtQ+DcWMZDaQmjAuB2Tgihd8aiBmvRzPAoB/oQobvA2kJhy7ZXwuEL6eZZPUzcRRGQsFwH9XxHhf8G0mBvlRL8hRywW+ZS/reDUA+DnF7M8Vvm15vb+GbTO92n46XxNnWCfjuoylHOGXkt/lZOVbU/gWI46JleOQfme9oYizAwNvMRGzKy177/DPk6W6EPi2lrqa8bznT8sYt7WPjYQiGcfl+Jhh1uuKOE2IUpUdMl7+w8CsxthJyFLMyF++i6c6wTaGQRpjkxxTTW0zldxjmKQJtsrxRsbr5JphlBynZJwsmqNUqVKlSv2/+g37bEpVt6AN6AAAAABJRU5ErkJggg=="
  
  return !likesQuerySnapshot.empty;
}

// Function to add a like to the "likes" collection
async function addLikeToCollection(postRef, userId) {
  await addDoc(collection(db, 'likes'), {
    postRef: postRef,
    userId: userId,
  });
}



let like =document.createElement("img")
like.classList.add("like")
like.src= "./images/like.png"
like.style.height = "1.3rem"
like.style.width = "1.3rem"
like.addEventListener("click", async () => {
  
  try { 
    if (!currentUser) {
      alert("You need to sign in to like a post.");
      return;
    }
    
    // Check if the user has already liked the post
    const hasLiked = await checkIfLiked(postRef, currentUser.uid);
    
    if (hasLiked) {
      
      like.src = "./images/like.png";
      //  else {
        //   
        // }
        
        // 
        // If the user has already liked the post, remove the like from the "likes" collection
        await removeLikeFromCollection(postRef, currentUser.uid);
        // Update the likes count to decrement by 1
        await updateLikesCount(postRef, -1);
        
      } else {
      like.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACKUlEQVR4nO2YPWsUURSGH/ADLNSAYKFWoo0Iohs12b1nRjSg2GurdvoPxEpLC0WxtfEvGIt0SrRQC2MaQTSChaJZ1A0W0cK8MpOA+xHdubuTnbsyLxwYhplzn/eeM5e5F0qVKlWqVKmMUoTJuCljRo5PMn7JmJfxWMY1xezJkGNv+uzyO/NpjuVcMzJuqIYjb8lRkfFIhrpEYuiextnekaPKZjnurjzTLc9DGYfygr8gx48MgzbHB1UZbYIflTHnlcOlY57rH94PvBngm2ocUMRBORo95zHO9wYfcVjGzz4GTuKt98zbKpVwVPwNGE/6hM8vHNN+8DWOFQ5tHRFlN+C4EwCw2qpwy6d9ZgsHto6Y8THwJcAK1H1aaDFAA4s+FXgfoIF3PhV4UDiwdcSkj4FLAQCrLS5mN3CELTK+BtQ+DcWMZDaQmjAuB2Tgihd8aiBmvRzPAoB/oQobvA2kJhy7ZXwuEL6eZZPUzcRRGQsFwH9XxHhf8G0mBvlRL8hRywW+ZS/reDUA+DnF7M8Vvm15vb+GbTO92n46XxNnWCfjuoylHOGXkt/lZOVbU/gWI46JleOQfme9oYizAwNvMRGzKy177/DPk6W6EPi2lrqa8bznT8sYt7WPjYQiGcfl+Jhh1uuKOE2IUpUdMl7+w8CsxthJyFLMyF++i6c6wTaGQRpjkxxTTW0zldxjmKQJtsrxRsbr5JphlBynZJwsmqNUqVKlSv2/+g37bEpVt6AN6AAAAABJRU5ErkJggg==";
      // If the user has not liked the post, add the like to the "likes" collection
      await addLikeToCollection(postRef, currentUser.uid);
      
      // Update the likes count to increment by 1
      await updateLikesCount(postRef, 1);
      audio.play()
      audio.loop = false
    }

    // Refresh the data to show the updated likes count
    getDataFromFirestore();

    console.log("Like toggled successfully!");
  } catch (error) {
    console.error("Error toggling like:", error);
  }
});
async function updateLikesCount(postRef, delta) {
  const postDoc = await getDoc(postRef);
  if (!postDoc.exists()) {
    throw new Error("Post does not exist!");
  }

  const currentLikes = postDoc.data().likes;

  // Update the likes count using the transaction function
  await setDoc(postRef, { likes: currentLikes + delta }, { merge: true });
}
let myCommentIcon =document.createElement("img")
myCommentIcon.classList.add("myCommentIcon")

myCommentIcon.src= "./images/comments.png"
myCommentIcon.style.height = "1.2rem"
myCommentIcon.style.width = "1.2rem"


myCommentIcon.addEventListener("click", () => {
  if (grandCommentContainer.style.display === "none") {
    grandCommentContainer.style.display = "block";
    grandCommentContainer.style.display = "block";
  } else {
    grandCommentContainer.style.display = "none";
    grandCommentContainer.style.display = "none";
  }
});
let repost =document.createElement("img")
repost.classList.add("repost")

repost.src= "./images/repost.png"
repost.style.height = "2.2rem"
repost.style.width = "1.7rem"
let share =document.createElement("img")
share.classList.add("share")

share.src= "./images/share.png"
share.style.height = "1.4rem"
share.style.width = "1.6rem"
myIcon.appendChild(like)
myIcon.appendChild(myCommentIcon)
myIcon.appendChild(repost)
myIcon.appendChild(share)
let likesAndReplies = document.createElement("div")
likesAndReplies.classList.add("likesAndReplies")
div.appendChild(likesAndReplies)
let totalReplies = document.createElement("span")
totalReplies.textContent = `${data.replies} replies . `
if(data.replies === 1){
  totalReplies.textContent = `${data.replies} reply . `
}
let totalLikes = document.createElement("span")
totalLikes.textContent = `${data.likes} likes`
if(data.likes === 1){
  totalLikes.textContent = `${data.likes} like`
}
likesAndReplies.appendChild(totalReplies)
likesAndReplies.appendChild(totalLikes)

    const postUserId = data.userId;
    timeAndDeletePostDiv.appendChild(span);
      let deleteButton = document.createElement('i');
deleteButton.classList.add('delete');
deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Replace button text with Font Awesome icon
timeAndDeletePostDiv.appendChild(deleteButton);

deleteButton.addEventListener('click', async () => {
  if (currentUser && currentUser.uid === postUserId) {
    const confirmDelete = await Swal.fire({
      icon: 'question',
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (confirmDelete.isConfirmed) {
      deletePost(docId);
    }
  } else {
    // Show SweetAlert dialog with the error message
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You have no access to delete this post',
    });
  }
});
let grandCommentContainer = document.createElement("div")
grandCommentContainer.style.display = 'none'
grandCommentContainer.classList.add("grandCommentContainer")
div.appendChild(grandCommentContainer)
    let commentContainer = document.createElement('div');
    commentContainer.classList.add('commentContainer');
    grandCommentContainer.appendChild(commentContainer);

    let commentRow = document.createElement('div');
    commentRow.classList.add('commentRow');
    grandCommentContainer.appendChild(commentRow);
  
    let commentInput = document.createElement('input');
    commentInput.placeholder = 'Enter a comment here';
    commentInput.classList.add('commentInput');
    commentRow.appendChild(commentInput);

    let commentButton = document.createElement('img');
    commentButton.src = 'https://img.icons8.com/ios-glyphs/60/paper-plane.png'; // Replace button text with Font Awesome icon
    commentButton.style.height = "20px"
    commentButton.style.width = "20px"
    commentButton.classList.add("addComment")
    commentRow.appendChild(commentButton);

    commentButton.addEventListener('click', async () => {

      const commentText = commentInput.value;
      const commentsCollection = collection(db, 'comments');
      await addDoc(commentsCollection, {
        postId: docId,
        comment: commentText,
        userId: currentUser.uid,
        userComment: currentUser.email
      });
    
      // Update the replies count in the posts collection
      await updateRepliesCount(postRef, 1);
    
      commentInput.value = '';
      getCommentsForPost(docId, commentContainer, div);
      console.log('Comment added to Firestore');
    });
    async function updateRepliesCount(postRef, delta) {
      const postDoc = await getDoc(postRef);
      if (!postDoc.exists()) {
        throw new Error("Post does not exist!");
      }
    
      const currentReplies = postDoc.data().replies;
    
      // Update the replies count using the transaction function
      await setDoc(postRef, { replies: currentReplies + delta }, { merge: true });
    }
    commentInput.value = '';
    getCommentsForPost(docId, commentContainer, div);
    console.log('Comment added to Firestore');
div.appendChild(hr);
    // postContainer.insertBefore(div, postContainer.firstChild);
  });

  console.log('Data retrieved from Firestore');


const getPostTime = (timestamp) => {
  const postDate = timestamp.toDate(); // Convert the Firestore timestamp to a JavaScript Date object
  const currentDate = new Date();

  const seconds = Math.floor((currentDate - postDate) / 1000); // Calculate the time difference in seconds

  if (seconds < 60) {
    return `now`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}d`;
  }
};

const getCommentsForPost = async (postId, container, div) => {
  // const commentsQuerySnapshot = await getDocs(query(collection(db, 'comments'), orderBy('timestamp', 'desc'), where('postId', '==', postId)));
  const commentsQuerySnapshot = await getDocs(query(collection(db, 'comments'), where('postId', '==', postId)));

  // Remove existing comments from the container
  container.innerHTML = '';

  commentsQuerySnapshot.forEach((commentSnapshot) => {
    const commentData = commentSnapshot.data();
    const commentUserId = commentData.userId;

    let commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    container.appendChild(commentElement);

    
      let commentDelete = document.createElement('i');
      commentDelete.classList.add('deleteComment');
      commentDelete.innerHTML = '<i class="fas fa-trash"></i>'; // Replace button text with Font Awesome icon
      commentElement.appendChild(commentDelete);

      // Add the event listener for comment deletion
     commentDelete.addEventListener('click', async () => {
  if (currentUser && currentUser.uid !== commentUserId) {
    // Show SweetAlert dialog with the error message
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You have no access to delete this comment',
    });
  } else {
    const confirmDelete = await Swal.fire({
      icon: 'question',
      title: 'Delete Comment',
      text: 'Are you sure you want to delete this comment?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (confirmDelete.isConfirmed) {
      await deleteDoc(doc(db, 'comments', commentSnapshot.id));

      // Update the replies count in the posts collection
      await updateRepliesCount(postRef, -1);

      getCommentsForPost(postId, commentContainer, div); // Fetch and add the updated comments
      console.log('Comment deleted successfully!');
    }
  }
});

      
    

    let commentUser = document.createElement("span");
    commentUser.classList.add("commentUser") // Corrected this line
    commentUser.textContent = commentData.userComment.replace(/@gmail\.com$/, ""); // Corrected this line
    commentElement.appendChild(commentUser);

    let commentText = document.createElement('span');
    commentText.style.color = 'black'
    commentText.textContent = commentData.comment;
    commentElement.appendChild(commentText);
  });

  console.log('Data retrieved from Firestore');
};

}
getDataFromFirestore()
