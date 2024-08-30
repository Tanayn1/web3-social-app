import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledText = styled(Text);

interface CustomInputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  inputStyle?: string;
  labelStyle?: string;
  containerStyle?: string;
  errorMessage?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  inputStyle = '',
  labelStyle = '',
  containerStyle = '',
  errorMessage = '',
  ...rest
}) => {
  return (
    <StyledView className={`mb-4 ${containerStyle}`}>
      {label && (
        <StyledText className={`text-gray-700 mb-2 ${labelStyle}`}>
          {label}
        </StyledText>
      )}
      <StyledTextInput
        className={`border border-gray-300 rounded-md px-4 py-2 ${inputStyle}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...rest}
      />
      {errorMessage !== '' && (
        <StyledText className="text-red-500 mt-1">{errorMessage}</StyledText>
      )}
    </StyledView>
  );
};

export default CustomInput;