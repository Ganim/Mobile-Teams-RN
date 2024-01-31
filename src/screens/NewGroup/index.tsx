import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";

export function NewGroup(){
  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  async function handleNew(){
    try{
      await groupCreate(group);
      navigation.navigate('players', {group});
    }catch(error){
      console.log(error);
    }
  }

  return(
    <Container>
      <Header showBackButton />
      <Content>

        <Icon />

        <Highlight
          title="Nova Turma"
          subtitle="Crie uma turma para adicionar pessoas"
        />

        <Input
          placeholder="Nome da Turma"
          onChangeText={setGroup}
        />

        <Button
          title="Criar Turma"
          style={{marginTop:20}}
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}