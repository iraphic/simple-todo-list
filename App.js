import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.graph.cool/simple/v1/cjyiicfwm2rzb0113sx7eavqw'
});

const todoListQuery = gql`
  query GetTodoList {
    allTodoes {
      id
      title
      content
      isFinished
    }
  }
`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      todoList: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    client.query({
      query: todoListQuery,
      fetchPolicy: 'network-only'
    })
    .then(result => {
      console.log(result.data);

      this.setState({
        todoList: result.data.allTodoes
      })
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Todo List</Text>
        <Text>Hello World!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#5cbcf4',
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center'
  },
});

export default App;
