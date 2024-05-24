import React from 'react';

// ErrorMessageコンポーネントのプロパティの型を定義
interface ErrorMessageProps {
  message: string | null; // messageはstring型またはnull型を持つ
}

// ErrorMessageコンポーネントを定義
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  // messageがnullの場合、何も表示しない
  if (!message) return null;

  // messageが存在する場合、エラーメッセージを表示する
  return <p className="c-error-message">{message}</p>;
};

// ErrorMessageコンポーネントをエクスポート
export default ErrorMessage;
