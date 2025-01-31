import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
  group: string
}

export function Players(){
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("")
  const [team, setTeam] = useState("Time A")
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const route = useRoute();
  const {group} = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null)

  const navigation = useNavigation();
  
  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert("Nova Pessoa", "Informe um nome")
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }
    try {

      await playerAddByGroup(newPlayer, group);
      
      newPlayerNameInputRef.current?.blur();

      setNewPlayerName("");
      fetchPlayersByTeam();
      
    }catch(error){
      if(error instanceof AppError){
        Alert.alert('Novo Player', error.message)
      }
      else{
        Alert.alert('Novo Player', 'Não foi possível adicionar.')
        console.log(error);
      }
      
    }
  }

  async function handlePlayerRemove(playerName: string){
    try {

      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
      
    }catch(error){
      if(error instanceof AppError){
        Alert.alert('Remover Player', error.message)
      }
      else{
        Alert.alert('Remover Player', 'Não foi possível remover.')
        console.log(error);
      }
      
    }
  }

  async function groupRemove(){
    try {

      await groupRemoveByName(group);
      navigation.navigate("groups")
      
    }catch(error){
      if(error instanceof AppError){
        Alert.alert('Remover Player', error.message)
      }
      else{
        Alert.alert('Remover Player', 'Não foi possível remover.')
        console.log(error);
      }
      
    }
  }

  function handleGroupEdit(group: string){
    navigation.navigate('edit', { group })
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        {text: "Não", style: 'cancel'},
        {text: "Sim", onPress:() => groupRemove()}
      ]
    )
  }
  

  async function fetchPlayersByTeam(){
    try {
      setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);

    }catch(error){
        Alert.alert('Players', 'Não foi possível carregar as pessoas.')
        console.log(error);
    }finally {
      setIsLoading(false);
    }
  }

  useEffect(() =>{
    fetchPlayersByTeam()
  },[team])
  
  return(
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />

      <Form>

        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />

      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={item => item}
          renderItem={({item})=>(
            <Filter 
              title={item}
              isActive={item === team}
              onPress={()=> setTeam(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false} 
        />
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>

      {
        isLoading ? <Loading /> : 
          <FlatList 
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard 
                name={item.name} 
                onRemove={() => handlePlayerRemove(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty message="Não há pessoas nesse time" />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />
      }
      
      <Button 
        title="Editar Turma"
        type="PRIMARY"
        onPress={()=> handleGroupEdit(group)}
        
      />

      <Button 
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
        
      />
        
    </Container>
  )
}