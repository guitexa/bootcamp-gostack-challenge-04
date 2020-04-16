import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then((response) => {
      setRepositories(response.data);
    });
  }, []);

  // Give a like to the repository and update state array
  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const getIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    repositories[getIndex].likes = response.data.likes;

    setRepositories([...repositories]);
  }

  // Delete repository and update state array
  function handleRemoveRepository(id) {
    api.delete(`/repositories/${id}`);

    setRepositories(repositories.filter((repository) => repository.id !== id));
  }

  // Create a new repository and update state array
  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Repo #${Date.now()}`,
      url: 'http://api.github.com',
      techs: ['NodeJS', 'React', 'React Native'],
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  // List existing repositories on state array
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#333" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repositories.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {repository.techs.map((tech) => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  ❤ {repository.likes}{' '}
                  {repository.likes > 1 ? 'curtidas' : 'curtida'}
                </Text>
              </View>
              <View style={styles.containerButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonTextLike}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button}
                  onPress={() => handleRemoveRepository(repository.id)}
                >
                  <Text style={styles.buttonTextDelete}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        ></FlatList>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonAdd}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonTextAdd}>Adicionar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  repositoryContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 4,
  },
  repository: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
    backgroundColor: '#00a02a',
    paddingHorizontal: 12,
    paddingVertical: 5,
    color: '#fff',
    borderRadius: 14,
  },
  likesContainer: {
    marginTop: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  containerButtons: {
    flexDirection: 'row',
  },
  button: {
    marginTop: 10,
  },
  buttonTextLike: {
    fontSize: 15,
    backgroundColor: '#7159c1',
    fontWeight: 'bold',
    marginRight: 15,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  buttonTextDelete: {
    fontSize: 15,
    backgroundColor: '#ca4949',
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    padding: 10,
    borderRadius: 5,
  },
  buttonAdd: {
    margin: 20,
  },
  buttonTextAdd: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
    borderRadius: 5,
  },
});
