import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";
import { groupEdit } from "@storage/group/groupEdit";
import { Container, Content, Icon } from "@screens/NewGroup/styles";

type RouteParams = {
  group: string
}

export function EditGroup(){
  const route = useRoute();
  const oldGroup = route.params as RouteParams;
  
  const [group, setGroup] = useState(oldGroup.group)

  const navigation = useNavigation()

  async function handleEdit(){
    try{
      if(group.trim().length ===0){
        return Alert.alert('Editar Grupo', 'Informe o nome do grupo.')
      }
      await groupEdit(group, oldGroup.group);
      navigation.navigate('players', {group});
    }catch(error){
      if(error instanceof AppError){
        Alert.alert('Editar Grupo', error.message)
      }
      else{
        Alert.alert('Editar Grupo', 'Não foi possível editar este grupo.')
        console.log(error);
      }
      
    }
  }

  return(
    <Container>
      <Header showBackButton />
      <Content>

        <Icon />

        <Highlight
          title="Editar Turma"
          subtitle="Altere o nome da turma já existente."
        />

        <Input
          placeholder="Nome da Turma" 
          value={group}      
          onChangeText={setGroup}
        />

        <Button
          title="Editar Turma"
          style={{marginTop:20}}
          onPress={handleEdit}
        />
      </Content>
    </Container>
  )
}