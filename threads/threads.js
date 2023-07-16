import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore,addDoc, collection,query, orderBy,where, getDocs,getDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyDxXGuWuxo9HjRzlCBO8w7WlqGa5GIObn0",
  authDomain: "threads-clone-29286.firebaseapp.com",
  projectId: "threads-clone-29286",
  storageBucket: "threads-clone-29286.appspot.com",
  messagingSenderId: "763972461983",
  appId: "1:763972461983:web:c1668ea87ac2468b1d89aa",
  measurementId: "G-4DHB611MR3"
};




const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let cancelButton = document.getElementById("cancelButton");


let postContainer = document.getElementById("postContainer");
let postDiv = document.getElementById("postDiv");
let createPost = document.getElementById("createPost");
let post = document.querySelector('.post');
let user = document.querySelector('.user');
let userPara = document.querySelector('#userPara');
let home = document.querySelector('.home');
let userLabel = document.querySelector('#userLabel');
let currentUser;


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
  postContainer.style.display = 'block';
  userDiv.style.display = 'none';
 postDiv.style.display = 'none'

});

user.addEventListener("click", () => {
  postContainer.style.display = 'none';
 postDiv.style.display = 'none'

  userDiv.style.display = 'block';
  userDiv.innerHTML = `Current User: ${currentUser.email}`;
});
post.addEventListener('click', async () => {
  postDiv.style.display = 'block';
  userDiv.style.display = 'none';
  postContainer.style.display = 'none';
  userLabel.innerHTML = currentUser.email;
});

// Assuming the element with ID "postButton" is the one you want to handle the post creation
const postButton = document.getElementById("postButton");
postButton.addEventListener("click", async () => {
  try {
    const postInput = document.querySelector('#myUser').value;
    postInput.focus()
    const postCollection = collection(db, 'posts');
postContainer.innerHTML = '';
    await addDoc(postCollection, {
      post: postInput,
      userId: currentUser.uid,
      timestamp: new Date(), // Add the timestamp field with the current date and time
      currentUser: currentUser.email 
    });

    document.querySelector('#myUser').value = '';
    const inputElement = document.querySelector('#myUser');
    inputElement.focus();
    getDataFromFirestore();
    postContainer.style.display = 'block';
    userDiv.style.display = 'none';
   postDiv.style.display = 'none'
    console.log("Data added to Firestore successfully");
  } catch (error) {
    console.error('Error adding document:', error);
    // Handle the error as needed, e.g., show an error message to the user.
  }

});
  cancelButton.addEventListener("click", ()=>{
    postContainer.style.display = 'block';
    userDiv.style.display = 'none';
   postDiv.style.display = 'none'
  })
const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
  getDataFromFirestore();
  alert('Post deleted successfully!');
}

// post.addEventListener('click', () => {


// });


const getDataFromFirestore = async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  postContainer.innerHTML = '';

  querySnapshot.forEach(async (snapshot) => {
    const docId = snapshot.id;
    const data = snapshot.data();

    const userDoc = await getDoc(doc(usersCollection, data.userId)); // Fetch the user document using userId

    let div = document.createElement('div');

    let ownerLabel = document.createElement('label');
    ownerLabel.classList.add('ownerLabel')
    ownerLabel.textContent = data.currentUser;
    ownerLabel.textContent= ownerLabel.textContent.replace(/@gmail\.com$/, "")
    div.appendChild(ownerLabel);

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
    div.appendChild(para);
div.appendChild(timeAndDeletePostDiv)
    

    const postUserId = data.userId;
    
      let deleteButton = document.createElement('i');
deleteButton.classList.add('delete');
deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Replace button text with Font Awesome icon
timeAndDeletePostDiv.appendChild(deleteButton);

      deleteButton.addEventListener('click', () => {
        if (currentUser && currentUser.uid === postUserId) {
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
          deletePost(docId);
        }
      }else{
        alert("You have no access to delete this post")
      }
      });
    
timeAndDeletePostDiv.appendChild(span);
    let commentContainer = document.createElement('div');
    commentContainer.classList.add('commentContainer');
    div.appendChild(commentContainer);

    let commentRow = document.createElement('div');
    commentRow.classList.add('commentRow');
    div.appendChild(commentRow);
  
    let commentInput = document.createElement('input');
    commentInput.placeholder = 'Enter a comment here';
    commentInput.classList.add('commentInput');
    commentRow.appendChild(commentInput);

    let commentButton = document.createElement('i');
    commentButton.innerHTML = '<i class="fas fa-arrow-right"></i>'; // Replace button text with Font Awesome icon
    commentButton.classList.add("addComment")
    commentRow.appendChild(commentButton);

    commentButton.addEventListener('click', async () => {
      const commentText = commentInput.value;
      const commentsCollection = collection(db, 'comments');
      await addDoc(commentsCollection, {
        postId: docId,
        comment: commentText,
        userId: currentUser.uid,
        userComment : currentUser.email
      });
      commentInput.value = '';
      getCommentsForPost(docId, commentContainer, div);
      console.log('Comment added to Firestore');
    });

    commentInput.value = '';
    getCommentsForPost(docId, commentContainer, div);
    console.log('Comment added to Firestore');
div.appendChild(hr);
    postContainer.insertBefore(div, postContainer.firstChild);
  });

  console.log('Data retrieved from Firestore');


const getPostTime = (timestamp) => {
  const postDate = timestamp.toDate(); // Convert the Firestore timestamp to a JavaScript Date object
  const currentDate = new Date();

  const seconds = Math.floor((currentDate - postDate) / 1000); // Calculate the time difference in seconds

  if (seconds < 60) {
    return `few seconds`;
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
        console.log("You have no access to delete this comment")

          alert("You have no access to delete this comment") }
        else{
           const confirmDelete = confirm('Are you sure you want to delete this comment?');
        if (confirmDelete) {
          await deleteDoc(doc(db, 'comments', commentSnapshot.id));
          getCommentsForPost(postId, container, div); // Fetch and add the updated comments
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
