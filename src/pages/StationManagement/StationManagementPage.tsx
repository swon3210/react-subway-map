import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Block from "../../components/Block/Block";
import { Flex, FlexCenter } from "../../components/@shared/FlexContainer/FlexContainer";
import ListItem from "../../components/ListItem/ListItem";
import useStation from "../../hooks/station";
import useInput from "../../hooks/@common/useInput";
import { validateStationName } from "../../validations/station";

// TODO : 에러 메세지 있을 때 예외처리 추가 필요

const StationManagementPage = () => {
  const { stations, createStation } = useStation();
  const [stationName, errorMessage, onStationNameChange, onStationNameBlur, setStationName] = useInput(
    validateStationName
  );

  const onAddStation: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    createStation(stationName);

    setStationName("");
  };

  return (
    <FlexCenter>
      <Block style={{ marginTop: "2.5rem", width: "540px", flexDirection: "column", alignItems: "flex-start" }}>
        <h2 style={{ marginBottom: "1rem" }}>🚉역 관리</h2>
        <form onSubmit={onAddStation} style={{ width: "100%" }}>
          <Flex style={{ width: "100%", marginBottom: "1rem" }}>
            <Flex style={{ width: "100%", flexDirection: "column", marginRight: "0.625rem" }}>
              <Input
                value={stationName}
                errorMessage={errorMessage}
                placeholder="역 이름"
                onChange={onStationNameChange}
                onBlur={onStationNameBlur}
                required
              ></Input>
            </Flex>
            <Button>확인</Button>
          </Flex>
        </form>
        <Flex style={{ width: "100%", flexDirection: "column" }}>
          {stations.map(({ id, name }) => (
            <ListItem key={id} style={{ padding: "0.5625rem" }}>
              {name}
            </ListItem>
          ))}
        </Flex>
      </Block>
    </FlexCenter>
  );
};
export default StationManagementPage;
