<template>
  <div>
    <div>
      <input type="text" v-model="title" placeholder="enter the title" />
      <button @click="addPost">ADD POST</button>
    </div>
    <div v-if="loading">
      <h2>LOADING...</h2>
    </div>
    <div v-else-if="error">{{error}}</div>
    <div v-else-if="result">
      <h2>Query Results...</h2>
      <div v-for="p in result.allPosts" :key="p.id">{{p}}</div>
    </div>
  </div>
</template>

<script>
// APOLLO IMPORTS
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@vue/apollo-composable";

// GRAPHQL QUERY FOR ALL POSTS
const ALL_POST_QUERY = gql`
  {
    allPosts {
      id
      title
      views
      User {
        id
        name
      }
    }
  }
`;

// GRAPHQL MUTATION
const ADD_POST_MUTATION = gql`
  mutation createPost($title: String!, $id: ID!, $userId: ID!) {
    createPost(title: $title, views: 0, user_id: $userId, id: $id) {
      id
      title
      views
      user_id
    }
  }
`;

export default {
  name: "HelloWorld",
  setup() {
    // composable for querying all posts data
    const { result, loading, error } = useQuery(ALL_POST_QUERY);

    // composable for mutating the data / and update local cache
   const {
      loading: m_loading,
      error: m_error,
       mutate: createPost
    } = useMutation(ADD_POST_MUTATION, {
      update: (cache, { data: { createPost } }) => {
        // get posts from cache
        const data = cache.readQuery({ query: ALL_POST_QUERY });
        // add the new post
        data.allPosts.push(createPost);
        // write results to cache
        cache.writeQuery({ query: ALL_POST_QUERY, data });
      }
    });

    // values returned to component and bound
    // as properties
    return {
      result,
      loading: loading || m_loading,
      error: error || m_error,
      createPost
    };
  },
  data() {
    return {
      title: ""
    };
  },
  methods: {
    addPost: function() {
      let id = new Date().getTime();
      let userId = 456;
      this.createPost({ title: this.title, id, userId });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  font-size: 20px;
}
input {
  font-size: 20px;
  width: 300px;
}
</style>
