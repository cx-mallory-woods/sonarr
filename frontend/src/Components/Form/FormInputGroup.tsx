import React, { ElementType, ReactNode } from 'react';
import Link from 'Components/Link/Link';
import { inputTypes } from 'Helpers/Props';
import { InputType } from 'Helpers/Props/inputTypes';
import { ValidationError, ValidationWarning } from 'typings/pending';
import translate from 'Utilities/String/translate';
import AutoCompleteInput from './AutoCompleteInput';
import CaptchaInput from './CaptchaInput';
import CheckInput from './CheckInput';
import FloatInput from './FloatInput';
import { FormInputButtonProps } from './FormInputButton';
import FormInputHelpText from './FormInputHelpText';
import KeyValueListInput from './KeyValueListInput';
import NumberInput from './NumberInput';
import OAuthInput from './OAuthInput';
import PasswordInput from './PasswordInput';
import PathInput from './PathInput';
import DownloadClientSelectInput from './Select/DownloadClientSelectInput';
import EnhancedSelectInput from './Select/EnhancedSelectInput';
import IndexerFlagsSelectInput from './Select/IndexerFlagsSelectInput';
import IndexerSelectInput from './Select/IndexerSelectInput';
import LanguageSelectInput from './Select/LanguageSelectInput';
import MonitorEpisodesSelectInput from './Select/MonitorEpisodesSelectInput';
import MonitorNewItemsSelectInput from './Select/MonitorNewItemsSelectInput';
import ProviderDataSelectInput from './Select/ProviderOptionSelectInput';
import QualityProfileSelectInput from './Select/QualityProfileSelectInput';
import RootFolderSelectInput from './Select/RootFolderSelectInput';
import SeriesTypeSelectInput from './Select/SeriesTypeSelectInput';
import UMaskInput from './Select/UMaskInput';
import DeviceInput from './Tag/DeviceInput';
import SeriesTagInput from './Tag/SeriesTagInput';
import TagSelectInput from './Tag/TagSelectInput';
import TextTagInput from './Tag/TextTagInput';
import TextArea from './TextArea';
import TextInput from './TextInput';
import styles from './FormInputGroup.css';

const componentMap: Record<InputType, ElementType> = {
  autoComplete: AutoCompleteInput,
  captcha: CaptchaInput,
  check: CheckInput,
  date: TextInput,
  device: DeviceInput,
  downloadClientSelect: DownloadClientSelectInput,
  dynamicSelect: ProviderDataSelectInput,
  file: TextInput,
  float: FloatInput,
  indexerFlagsSelect: IndexerFlagsSelectInput,
  indexerSelect: IndexerSelectInput,
  keyValueList: KeyValueListInput,
  languageSelect: LanguageSelectInput,
  monitorEpisodesSelect: MonitorEpisodesSelectInput,
  monitorNewItemsSelect: MonitorNewItemsSelectInput,
  number: NumberInput,
  oauth: OAuthInput,
  password: PasswordInput,
  path: PathInput,
  qualityProfileSelect: QualityProfileSelectInput,
  rootFolderSelect: RootFolderSelectInput,
  select: EnhancedSelectInput,
  seriesTag: SeriesTagInput,
  seriesTypeSelect: SeriesTypeSelectInput,
  tag: SeriesTagInput,
  tagSelect: TagSelectInput,
  text: TextInput,
  textArea: TextArea,
  textTag: TextTagInput,
  umask: UMaskInput,
} as const;

// type Components = typeof componentMap;

export interface FormInputGroupProps {
  type: InputType;
  name: string;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  buttons?: ReactNode | ReactNode[];
  helpText?: string;
  helpTexts?: string[];
  helpTextWarning?: string;
  helpLink?: string;
  unit?: string;
  errors?: ({ message: string } | ValidationError)[];
  warnings?: ({ message: string } | ValidationWarning)[];
  [key: string]: any;
}

export interface FormInputGroupValues<T> {
  key: T;
  value: string;
  hint?: string;
}

// TODO: Remove once all parent components are updated to TSX and we can refactor to a consistent type
export interface ValidationMessage {
  message: string;
}

function FormInputGroup(
  props: FormInputGroupProps
) {
  const {
    className = styles.inputGroup,
    containerClassName = styles.inputGroupContainer,
    inputClassName,
    type,
    unit,
    buttons = [],
    helpText,
    helpTexts = [],
    helpTextWarning,
    helpLink,
    pending,
    errors = [],
    warnings = [],
    ...otherProps
  } = props;

  const InputComponent = componentMap[type];
  const checkInput = type === inputTypes.CHECK;
  const hasError = !!errors.length;
  const hasWarning = !hasError && !!warnings.length;
  const buttonsArray = React.Children.toArray(buttons);
  const lastButtonIndex = buttonsArray.length - 1;
  const hasButton = !!buttonsArray.length;

  return (
    <div className={containerClassName}>
      <div className={className}>
        <div className={styles.inputContainer}>
          <InputComponent
            className={inputClassName}
            helpText={helpText}
            helpTextWarning={helpTextWarning}
            hasError={hasError}
            hasWarning={hasWarning}
            hasButton={hasButton}
            {...otherProps}
          />

          {unit && (
            <div
              className={
                type === inputTypes.NUMBER
                  ? styles.inputUnitNumber
                  : styles.inputUnit
              }
            >
              {unit}
            </div>
          )}
        </div>

        {buttonsArray.map((button, index) => {
          if (!React.isValidElement<FormInputButtonProps>(button)) {
            return button;
          }

          return React.cloneElement(button, {
            isLastButton: index === lastButtonIndex,
          });
        })}

        {/* <div className={styles.pendingChangesContainer}>
          {
          pending &&
          <Icon
          name={icons.UNSAVED_SETTING}
          className={styles.pendingChangesIcon}
          title="Change has not been saved yet"
          />
          }
        </div> */}
      </div>

      {!checkInput && helpText ? <FormInputHelpText text={helpText} /> : null}

      {!checkInput && helpTexts ? (
        <div>
          {helpTexts.map((text, index) => {
            return (
              <FormInputHelpText
                key={index}
                text={text}
                isCheckInput={checkInput}
              />
            );
          })}
        </div>
      ) : null}

      {(!checkInput || helpText) && helpTextWarning ? (
        <FormInputHelpText text={helpTextWarning} isWarning={true} />
      ) : null}

      {helpLink ? <Link to={helpLink}>{translate('MoreInfo')}</Link> : null}

      {errors.map((error, index) => {
        return 'errorMessage' in error ? (
          <FormInputHelpText
            key={index}
            text={error.errorMessage}
            link={error.infoLink}
            tooltip={error.detailedDescription}
            isError={true}
            isCheckInput={checkInput}
          />
        ) : (
          <FormInputHelpText
            key={index}
            text={error.message}
            isError={true}
            isCheckInput={checkInput}
          />
        );
      })}

      {warnings.map((warning, index) => {
        return 'errorMessage' in warning ? (
          <FormInputHelpText
            key={index}
            text={warning.errorMessage}
            link={warning.infoLink}
            tooltip={warning.detailedDescription}
            isWarning={true}
            isCheckInput={checkInput}
          />
        ) : (
          <FormInputHelpText
            key={index}
            text={warning.message}
            isWarning={true}
            isCheckInput={checkInput}
          />
        );
      })}
    </div>
  );
}

export default FormInputGroup;
