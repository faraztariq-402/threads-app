import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore,addDoc, collection,query, orderBy,where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



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

let postContainer = document.getElementById("postContainer");
let createPost = document.getElementById("createPost");
let post = document.querySelector('.post');
let user = document.querySelector('.user');
let userPara = document.querySelector('#userPara');
let home = document.querySelector('.home');

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

home.addEventListener("click", () => {
  postContainer.style.display = 'block';
  userDiv.style.display = 'none';
});

user.addEventListener("click", () => {
  postContainer.style.display = 'none';
  userDiv.style.display = 'block';
  userDiv.innerHTML = `Current User: ${currentUser.email}`;
});

post.addEventListener('click', () => {
  Swal.fire({
    title: 'New Thread',
    html: `
      <div class="underline"></div>
      <img src="./images/user_profile-removebg-preview.png" class="userProfile">
      <label class="userName">${currentUser.email}</label>
      <input id="postInput" type="text" class="swal2-input" placeholder="Start a thread...">
      <p class="reply">Anyone can reply</p>
    `,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Post',
    showLoaderOnConfirm: true,
    customClass: {
      popup: 'swal2-popup-custom',
      cancelButton: 'swal2-cancel-button-custom'
    },
    preConfirm: async () => {
      const postInput = Swal.getPopup().querySelector('#postInput');
      const postCollection = collection(db, 'posts');
      await addDoc(postCollection, {
        post: postInput.value,
        userId: currentUser.uid
      });
    },
    allowOutsideClick: () => !Swal.isLoading(),
    didOpen: () => {
      const postInput = Swal.getPopup().querySelector('#postInput');
      postInput.focus();
    }
  }).then((result) => {
    if (result.isConfirmed) {
      postContainer.innerHTML = '';
      getDataFromFirestore();
      console.log("Data added to Firestore successfully");
    }
  });
});

const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
  getDataFromFirestore();
  alert('Post deleted successfully!');
};

const getDataFromFirestore = async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  postContainer.innerHTML = '';

  querySnapshot.forEach((snapshot) => {
    const docId = snapshot.id;
    const data = snapshot.data();

    let div = document.createElement('div');
    let para = document.createElement('p');
    para.innerHTML = data.post;
    para.classList.add('myPara');
    div.classList.add('myDiv');
    div.appendChild(para);

    const postUserId = data.userId;
    if (currentUser && currentUser.uid === postUserId) {
      // let ownerLabel = document.createElement('label');
      // ownerLabel.textContent = currentUser.email;
      // ownerLabel.classList.add('ownerLabel');
      // div.insertBefore(ownerLabel, para);

      let deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.textContent = 'Delete Post';
      div.appendChild(deleteButton);

      deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
          deletePost(docId);
        }
      });
    }

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

    let commentButton = document.createElement('button');
    commentButton.textContent = 'Add Comment';
    commentButton.classList.add('commentButton');
    commentRow.appendChild(commentButton);

    commentButton.addEventListener('click', async () => {
      const commentText = commentInput.value;
      const commentsCollection = collection(db, 'comments');
      await addDoc(commentsCollection, {
        postId: docId,
        comment: commentText,
        userId: currentUser.uid
      });
      commentInput.value = '';
      getCommentsForPost(docId, commentContainer);
      console.log('Comment added to Firestore');
    });

    getCommentsForPost(docId, commentContainer);

    postContainer.insertBefore(div, postContainer.firstChild);
  });

  console.log('Data retrieved from Firestore');
};

const getCommentsForPost = async (postId, container) => {
  const commentsQuerySnapshot = await getDocs(query(collection(db, 'comments'), where('postId', '==', postId)));
  container.innerHTML = '';

  commentsQuerySnapshot.forEach((commentSnapshot) => {
    const commentData = commentSnapshot.data();

    let commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.textContent = commentData.comment;

    container.appendChild(commentElement);
  });
};

getDataFromFirestore();
console.log('Data retrieved from Firestore');