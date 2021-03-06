import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { reduxForm, Field, FieldArray, getFormValues } from 'redux-form';
import { collectionOf, reduxFormValidate, ErrorMessages, ErrorMessage, arrayOf } from 'react-nebo15-validate';

import Form, { FormRow, FormBlock, FormButtons, FormColumn, FormError } from 'components/Form';
import FieldCheckbox from 'components/reduxForm/FieldCheckbox';
import FieldInput from 'components/reduxForm/FieldInput';
import Button, { ButtonsGroup } from 'components/Button';
import ShowWithScope from 'containers/blocks/ShowWithScope';

const getValues = getFormValues('dictionary-form');

@translate()
@reduxForm({
  form: 'dictionary-form',
  validate: reduxFormValidate({
    values: collectionOf({
      key: {
        required: true,
      },
      value: {
        required: true,
      },
    }, {
      required: true,
      minLength: 1,
      uniqueKey: 'key',
    }),
  }),
  labels: arrayOf({
    required: true,
  }, {
    unique: true,
  }),
})
@connect(state => ({
  values: getValues(state),
}))
export default class DictionaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      savedValues: props.initialValues,
    };
  }
  onSubmit(values, ...args) {
    if (typeof this.props.onSubmit !== 'function') {
      this.setState({
        savedValues: values,
      });
      return true;
    }
    const submitRes = this.props.onSubmit(values, ...args);
    if (typeof submitRes !== 'function') {
      this.setState({
        savedValues: values,
      });
      return submitRes;
    }

    submitRes.then(() => {
      this.setState({
        savedValues: values,
      });
    });

    return submitRes;
  }
  get isChanged() {
    const { values = [] } = this.props;
    return JSON.stringify(values) !== JSON.stringify(this.state.savedValues);
  }
  render() {
    const { handleSubmit, readOnly, submitting, t } = this.props;

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <FormBlock title={t('General')}>
          <FormRow>
            <Field name="is_active" labelText={t('Is active')} component={FieldCheckbox} disabled={readOnly} />
          </FormRow>
        </FormBlock>
        <FieldArray name="values" component={renderFields} readOnly={readOnly} />
        <FieldArray name="labels" component={labelFields} readOnly={readOnly} />
        <FormButtons>
          <ShowWithScope scope="dictionary:write">
            <ButtonsGroup>
              <Button type="submit" disabled={!this.isChanged}>{
                submitting ? t('Saving...') : (this.isChanged ? t('Save Dictionary') : t('Saved'))
              }</Button>
            </ButtonsGroup>
          </ShowWithScope>
        </FormButtons>
      </Form>
    );
  }
}

const labelFields = translate()(({ fields, readOnly, t }) => (
  <FormBlock title={t('Labels')}>
    {fields.map((item, index) => (
      <FormRow key={index}>
        <FormColumn>
          <Field
            name={item}
            labelText={index === 0 && t('Name')}
            component={FieldInput}
            placeholder={t('Label name')}
            readOnly={readOnly}
          />
        </FormColumn>
        <ShowWithScope scope="dictionary:write">
          {
            !readOnly && (
              <FormColumn align="bottom">
                <Button color="red" type="button" size="small" onClick={() => fields.remove(index)} tabIndex={-1}>
                  { t('Remove') }
                </Button>
              </FormColumn>
            )
          }
        </ShowWithScope>
      </FormRow>
    ))}
    <ShowWithScope scope="dictionary:write">
      {
        !readOnly && (
          <FormButtons>
            <Button type="button" color="blue" size="small" onClick={() => fields.push()}>
              {t('Add Item')}
            </Button>
          </FormButtons>
        )
      }
    </ShowWithScope>
  </FormBlock>
));

const renderFields = translate()(({ fields, readOnly, meta, t }) => (
  <FormBlock title={t('Values')}>
    {fields.map((item, index) =>
      <FormRow key={index}>
        <FormColumn>
          <Field
            name={`${item}.key`}
            labelText={index === 0 && t('Key')}
            component={FieldInput}
            placeholder={t('Item key')}
            readOnly={readOnly}
          />
        </FormColumn>
        <FormColumn>
          <Field
            name={`${item}.value`}
            labelText={index === 0 && t('Description')}
            component={FieldInput}
            placeholder={t('Item description')}
            readOnly={readOnly}
          />
        </FormColumn>
        <ShowWithScope scope="dictionary:write">
          {
            !readOnly && (
              <FormColumn align="bottom">
                <Button color="red" type="button" size="small" onClick={() => fields.remove(index)} tabIndex={-1}>
                  { t('Remove') }
                </Button>
              </FormColumn>
            )
          }
        </ShowWithScope>
      </FormRow>
    )}
    <ShowWithScope scope="dictionary:write">
      {
        !readOnly && (
          <FormButtons>
            <Button type="button" color="blue" size="small" onClick={() => fields.push({})}>
              {t('Add Item')}
            </Button>
          </FormButtons>
        )
      }
    </ShowWithScope>
    { meta.error && (
      <FormError>
        <ErrorMessages error={meta.error}>
          <ErrorMessage when="uniqueKey">{ t('You have not unique values in key: <%= params %>') }</ErrorMessage>
        </ErrorMessages>
      </FormError>
    )}
  </FormBlock>
));
