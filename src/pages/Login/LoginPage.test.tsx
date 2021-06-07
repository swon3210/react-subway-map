import { render, fireEvent, act, waitFor, cleanup } from "@testing-library/react";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "../../hooks";

import LoginPage from "./LoginPage";
import initialState from "../../fixtures/redux";
import mockStore from "../../@test/mockStore";
import { INPUT_PLACEHOLDER } from "../../constants/placeholder";
import { TEST_USER } from "../../fixtures/user";
import { TEST_ID } from "../../@test/testId";
import { action } from "../../modules/auth";

type LoginInfo = {
  EMAIL: string;
  PASSWORD: string;
};

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("../../hooks");

const mockRedux = () => {
  const store = mockStore(initialState);

  const mockedUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;
  mockedUseAppSelector.mockImplementation((selector) => selector(store.getState()));

  const mockedUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>;
  mockedUseAppDispatch.mockImplementation(() => store.dispatch);

  return store;
};

const initAxiosMock = () => {
  const mockedAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
  mockedAxiosPost.mockImplementation(async () => ({ data: "" }));
};

beforeEach(() => {
  cleanup();
  jest.spyOn(window, "alert").mockImplementation(() => true);
  initAxiosMock();
});

const fillLoginForm = (loginInfo: LoginInfo) => {
  const { getByPlaceholderText, getByTestId } = render(<LoginPage />);
  const EmailInput = getByPlaceholderText(INPUT_PLACEHOLDER.EMAIL);
  const PasswordInput = getByPlaceholderText(INPUT_PLACEHOLDER.PASSWORD);
  const loginButton = getByTestId(TEST_ID.LOGIN_BUTTON);

  act(() => {
    fireEvent.change(EmailInput, { target: { value: loginInfo.EMAIL } });
    fireEvent.change(PasswordInput, { target: { value: loginInfo.PASSWORD } });
  });

  act(() => {
    fireEvent.click(loginButton);
  });
};

describe("로그인", () => {
  describe("이메일 유효성 검사", () => {
    describe("모든 유효성이 통과한다면", () => {
      it("로그인을 할 수 있다.", () => {
        const store = mockRedux();

        fillLoginForm(TEST_USER);

        waitFor(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(2);

          const [action1, action2] = actions;
          expect(action1).toMatchObject({ type: action.signup.pending.type });
          expect(action2).toMatchObject({ type: action.signup.fulfilled.type });
        });
      });
    });
    describe("이메일 형식이 올바르지 않다면", () => {
      it("로그인을 할 수 없다.", () => {
        const store = mockRedux();

        fillLoginForm({ ...TEST_USER, EMAIL: "testEmail" });

        waitFor(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(2);

          const [action1, action2] = actions;
          expect(action1).toMatchObject({ type: action.signup.pending.type });
          expect(action2).toMatchObject({ type: action.signup.rejected.type });
        });
      });
    });

    describe("이메일 전체 글자 수가 30글자를 넘는다면", () => {
      it("로그인을 할 수 없다.", () => {
        const store = mockRedux();

        fillLoginForm({ ...TEST_USER, EMAIL: "testtesttesttesttesttesttesttesttesttesttesttest@naver.com" });

        waitFor(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(2);

          const [action1, action2] = actions;
          expect(action1).toMatchObject({ type: action.signup.pending.type });
          expect(action2).toMatchObject({ type: action.signup.rejected.type });
        });
      });
    });
  });
  describe("비밀번호 유효성 검사", () => {
    describe("비밀번호가 4글자 미만이라면", () => {
      it("로그인을 할 수 없다.", () => {
        const store = mockRedux();

        fillLoginForm({ ...TEST_USER, PASSWORD: "tes" });

        waitFor(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(2);

          const [action1, action2] = actions;
          expect(action1).toMatchObject({ type: action.signup.pending.type });
          expect(action2).toMatchObject({ type: action.signup.rejected.type });
        });
      });
    });

    describe("비밀번호가 20글자보다 많다면", () => {
      it("로그인을 할 수 없다.", () => {
        const store = mockRedux();

        fillLoginForm({ ...TEST_USER, PASSWORD: "testtesttesttesttesttest" });

        waitFor(() => {
          const actions = store.getActions();
          expect(actions).toHaveLength(2);

          const [action1, action2] = actions;
          expect(action1).toMatchObject({ type: action.signup.pending.type });
          expect(action2).toMatchObject({ type: action.signup.rejected.type });
        });
      });
    });
  });
});
