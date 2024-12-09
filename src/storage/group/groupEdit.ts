import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";

export async function groupEdit(newGroup: string, searchByName: string){
  try{
     /* Verifica se já existe um grupo com esse nome */
    const storedGroups = await groupsGetAll();
    const storedPlayers = await playersGetByGroup(newGroup);

    const groupAlreadyExists = storedGroups.includes(newGroup);

    if(groupAlreadyExists){
      throw new AppError('Já existe um grupo com este nome!')
    }

    /* Cria o novo grupo */
    const groups = storedGroups.filter(group => group !== searchByName);
    
    const groupStorage = JSON.stringify([...groups, newGroup])

    await AsyncStorage.setItem(GROUP_COLLECTION, groupStorage);


    /* Transferir Jogadores para o novo grupo */
    const playersList = await playersGetByGroup(searchByName);


    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${newGroup}`, JSON.stringify(playersList))

    
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${searchByName}`);

  }catch(error){

    throw error;

  }
}