import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
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

const createTodoMutation = gql`
  mutation CreateTodo($title: String!, $content: String!) {
    createTodo(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      todoList: [],
      showModal: false,
      title: '',
      content: ''
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

  saveTodo = () => {
    if (!this.state.title || !this.state.content) return;

    client.mutate({
      mutation: createTodoMutation,
      variables: {
        title: this.state.title,
        content: this.state.content
      }
    })
    .then(result => {
      this.setState({
        showModal: false,
        title: '',
        content: ''
      });

      // reload data
      this.loadData();
    })
    .catch(error => {
      console.log(error);
    });
  };

  renderCreateNewButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => this.setState({ showModal: true })}
    >
      <Text style={styles.textButton}>Create New +</Text>
    </TouchableOpacity>
  );

  renderModal = () => (
    <Modal visible={this.state.showModal} animationType={'slide'}>

      <Text style={styles.modalTitle}>Add New</Text>

      <TextInput
        style={styles.input}
        placeholder={'Input title..'}
        value={this.state.title}
        onChangeText={(text) => this.setState({ title: text })}
      />

      <TextInput
        style={styles.input}
        placeholder={'Input content..'}
        value={this.state.content}
        onChangeText={(text) => this.setState({ content: text })}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => this.saveTodo()}>
        <Text style={styles.textButton}>Create</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => this.setState({ showModal: false })}>
        <Text>Cancel</Text>
      </TouchableOpacity>

    </Modal>
  );

  renderItem = (item) => {
    return (
      <View style={styles.list}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{item.title}</Text>
        <Text>{item.content}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Todo List</Text>

        {this.renderCreateNewButton()}

        <FlatList
          data={this.state.todoList}
          renderItem={({ item }) => this.renderItem(item)}
          keyExtractor={({ item }, index) => index.toString()}
        />

        {this.renderModal()}
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
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  textButton: {
    color: '#5cbcf4',
    fontSize: 16,
    fontWeight: '500'
  },
  list: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10
  },
  modalTitle: {
    marginVertical: 40,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center'
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#dedede',
    marginVertical: 15,
    marginHorizontal: 20
  }
});

export default App;
