import {
  AcceptCommand,
  CancelCommand,
  ChangePinCommand,
  Commands,
  EnterCanCommand,
  EnterPinCommand,
  EnterPukCommand,
  GetCertificateCommand,
  GetInfoCommand,
  Handler,
  InitCommand,
  RunAuthCommand,
  SetAccessRightsCommand,
  SetNewPinCommand,
} from './commandTypes'
import {
  AccessRightsMessage,
  AuthMessage,
  BadStateMessage,
  CertificateMessage,
  ChangePinMessage,
  EnterCanMessage,
  EnterNewPinMessage,
  EnterPinMessage,
  EnterPukMessage,
  InfoMessage,
  InitMessage,
  InsertCardMessage,
  Messages,
} from './messageTypes'
import { AccessRightsFields, ScannerConfig } from './types'

export const initSdkCmd = (
  callback: Handler<InitMessage>,
): InitCommand<InitMessage> => ({
  command: { cmd: Commands.init },

  handler: {
    canHandle: [Messages.init],
    handle: callback,
  },
})

export const getInfoCmd = (): GetInfoCommand<InfoMessage> => {
  return {
    command: { cmd: Commands.getInfo },
    handler: {
      canHandle: [Messages.info],
      handle: (message, _, { resolve }) => resolve(message),
    },
  }
}

export const runAuthCmd = (
  tcTokenURL: string,
  config?: ScannerConfig,
): RunAuthCommand<AccessRightsMessage | AuthMessage> => {
  return {
    command: {
      cmd: Commands.runAuth,
      tcTokenURL,
      handleInterrupt: true,
      messages: {
        sessionStarted:
          config?.sessionStarted ??
          "Please place your ID card on the top of the device's back side.",
        sessionFailed: config?.sessionFailed ?? 'Scanning process failed.',
        sessionSucceeded:
          config?.sessionSucceeded ??
          'Scanning process has been finished successfully.',
        sessionInProgress:
          config?.sessionInProgress ?? 'Scanning process is in progress.',
      },
    },
    handler: {
      canHandle: [Messages.accessRights, Messages.auth],
      handle: (message, _, { resolve, reject }) => {
        if (message.msg === Messages.auth && message.error) {
          return reject(new Error(message.error))
        }
        if (message.msg === Messages.accessRights) {
          return resolve(message)
        }
      },
    },
  }
}

export const changePinCmd = (
  config?: ScannerConfig,
): ChangePinCommand<
  | BadStateMessage
  | EnterPinMessage
  | EnterPukMessage
  | EnterCanMessage
  | ChangePinMessage
> => {
  return {
    command: {
      cmd: Commands.runChangePin,
      handleInterrupt: true,
      messages: {
        sessionStarted:
          config?.sessionStarted ??
          "Please place your ID card on the top of the device's back side.",
        sessionFailed: config?.sessionFailed ?? 'Scanning process failed.',
        sessionSucceeded:
          config?.sessionSucceeded ??
          'Scanning process has been finished successfully.',
        sessionInProgress:
          config?.sessionInProgress ?? 'Scanning process is in progress.',
      },
    },
    handler: {
      canHandle: [
        Messages.badState,
        Messages.enterPin,
        Messages.enterPuk,
        Messages.enterCan,
        Messages.changePin,
      ],
      handle: (
        message,
        {
          handlePinRequest,
          handlePukRequest,
          handleCanRequest,
          handleChangePin,
        },
        { resolve, reject },
      ) => {
        switch (message.msg) {
          case Messages.enterPin:
            handlePinRequest && handlePinRequest(message.reader.card)
            return resolve(message)
          case Messages.enterPuk:
            handlePukRequest && handlePukRequest(message.reader.card)
            return resolve(message)
          case Messages.enterCan:
            handleCanRequest && handleCanRequest(message.reader.card)
            return resolve(message)
          case Messages.changePin:
            handleChangePin && handleChangePin(message.success)
            /**
             * NOTE: happens on iOS
             * when cancelling NFC popup when INSERT_CARD
             * msg comes in (before ENTER_PIN msg) in RUN_CHANGE_PIN wf
             */
            if (typeof message.success === 'boolean') {
              return resolve(message)
            }
            return
          default:
            return reject(new Error(message.error))
        }
      },
    },
  }
}

export const enterPukCmd = (
  puk: string,
): EnterPukCommand<
  BadStateMessage | EnterPinMessage | EnterPukMessage | ChangePinMessage
> => {
  return {
    command: {
      cmd: Commands.setPuk,
      value: puk,
    },
    handler: {
      canHandle: [
        Messages.badState,
        Messages.enterPin,
        Messages.enterPuk,
        Messages.changePin,
      ],
      handle: (message, eventHandlers, { reject, resolve }) => {
        const {
          handlePukRequest,
          handlePinRequest,
          handleChangePin,
        } = eventHandlers
        switch (message.msg) {
          case Messages.changePin:
            /**
             * NOTE: happens when pressing
             * cancel on NFC popup during
             * the RUN_CHANGE_PIN flow;
             * on iOS AA2SDk send it declaratively
             * after pressing Cancel on the popup;
             * on Android Cancel btn sends CANCEL cmd
             * which returns this message
             */
            handleChangePin && handleChangePin(message.success)
            return resolve(message)
          case Messages.enterPin:
            handlePinRequest && handlePinRequest(message.reader.card)
            return resolve(message)
          case Messages.enterPuk:
            handlePukRequest && handlePukRequest(message.reader.card)
            return resolve(message)
          default:
            return reject(new Error(message.error))
        }
      },
    },
  }
}

export const enterCanCmd = (
  can: string,
): EnterCanCommand<
  BadStateMessage | EnterPinMessage | EnterCanMessage | ChangePinMessage
> => {
  return {
    command: {
      cmd: Commands.setCan,
      value: can,
    },
    handler: {
      canHandle: [Messages.enterPin, Messages.enterCan, Messages.changePin],
      handle: (message, eventHandlers, { resolve, reject }) => {
        const {
          handleCanRequest,
          handlePinRequest,
          handleChangePin,
        } = eventHandlers

        switch (message.msg) {
          case Messages.changePin:
            /**
             * NOTE: happens when pressing
             * cancel on NFC popup during
             * the RUN_CHANGE_PIN flow;
             * on iOS AA2SDk send it declaratively
             * after pressing Cancel on the popup;
             * on Android Cancel btn sends CANCEL cmd
             * which returns this message
             */
            handleChangePin && handleChangePin(message.success)
            return resolve(message)
          case Messages.enterPin:
            handlePinRequest && handlePinRequest(message.reader.card)
            return resolve(message)
          case Messages.enterCan:
            handleCanRequest && handleCanRequest(message.reader.card)
            return resolve(message)

          default:
            return reject(new Error(message.error))
        }
      },
    },
  }
}

export const enterPinCmd = (
  pin: string,
): EnterPinCommand<
  | EnterPinMessage
  | EnterPukMessage
  | EnterCanMessage
  | AuthMessage
  | EnterNewPinMessage
  | ChangePinMessage
> => {
  return {
    command: {
      cmd: Commands.setPin,
      value: pin,
    },
    handler: {
      canHandle: [
        Messages.enterPuk,
        Messages.enterPin,
        Messages.enterCan,
        Messages.auth,
        Messages.enterNewPin,
        Messages.changePin,
      ],
      handle: (message, eventHandlers, { resolve, reject }) => {
        const {
          handleCanRequest,
          handleAuthResult,
          handlePinRequest,
          handlePukRequest,
          handleEnterNewPin,
          handleChangePin,
        } = eventHandlers

        switch (message.msg) {
          case Messages.changePin:
            /**
             * NOTE: happens when pressing
             * cancel on NFC popup during
             * the RUN_CHANGE_PIN flow;
             * on iOS AA2SDk send it declaratively
             * after pressing Cancel on the popup;
             * on Android Cancel btn sends CANCEL cmd
             * which returns this message
             */
            handleChangePin && handleChangePin(message.success)
            return resolve(message)
          case Messages.enterNewPin:
            handleEnterNewPin && handleEnterNewPin()
            return resolve(message)
          case Messages.auth:
            if (message.url) {
              handleAuthResult && handleAuthResult(message.url)
              return resolve(message)
            } else return reject(message)
          case Messages.enterPin:
            handlePinRequest && handlePinRequest(message.reader?.card)
            return resolve(message)
          case Messages.enterPuk:
            handlePukRequest && handlePukRequest(message.reader?.card)
            return resolve(message)
          case Messages.enterCan:
            handleCanRequest && handleCanRequest(message.reader?.card)
            return resolve(message)
          default:
            return reject(new Error('Unknown message type'))
        }
      },
    },
  }
}

export const acceptAuthReqCmd = (): AcceptCommand<
  EnterPinMessage | EnterPukMessage | EnterCanMessage | InsertCardMessage
> => {
  return {
    command: {
      cmd: Commands.accept,
    },
    handler: {
      canHandle: [
        Messages.insertCard,
        Messages.enterPin,
        Messages.enterCan,
        Messages.enterPuk,
      ],
      handle: (
        message,
        {
          handleCardRequest,
          handlePinRequest,
          handlePukRequest,
          handleCanRequest,
        },
        { resolve, reject },
      ) => {
        switch (message.msg) {
          case Messages.insertCard:
            handleCardRequest && handleCardRequest()
            return
          case Messages.enterPin:
            handlePinRequest && handlePinRequest(message.reader.card)
            return resolve(message)
          case Messages.enterPuk:
            handlePukRequest && handlePukRequest(message.reader.card)
            return resolve(message)
          case Messages.enterCan:
            handleCanRequest && handleCanRequest(message.reader.card)
            return resolve(message)
          default:
            return reject(new Error('Unknown message type'))
        }
      },
    },
  }
}

export const getCertificate = (): GetCertificateCommand<CertificateMessage> => {
  return {
    command: { cmd: Commands.getCertificate },
    handler: {
      canHandle: [Messages.certificate],
      handle: (message, _, { resolve }) => resolve(message),
    },
  }
}

export const cancelFlow = (): CancelCommand<
  BadStateMessage | AuthMessage | ChangePinMessage
> => {
  return {
    command: { cmd: Commands.cancel },
    handler: {
      canHandle: [Messages.auth, Messages.badState, Messages.changePin],
      handle: (message, { handleChangePin }, { resolve, reject }) => {
        switch (message.msg) {
          case Messages.auth:
            return resolve(message)
          case Messages.badState:
            return reject(message.error)
          case Messages.changePin:
            handleChangePin && handleChangePin(message.success)
            return resolve(message)
          default:
            return reject(new Error('Unknown message type'))
        }
      },
    },
  }
}

export const setAccessRights = (
  optionalFields: Array<AccessRightsFields>,
): SetAccessRightsCommand<AccessRightsMessage | BadStateMessage> => {
  return {
    command: { cmd: Commands.setAccessRights, chat: optionalFields },
    handler: {
      canHandle: [Messages.accessRights, Messages.badState],
      handle: (message, _, { resolve, reject }) => {
        switch (message.msg) {
          case Messages.accessRights:
            return resolve(message)
          case Messages.badState:
            return reject(message.error)
          default:
            return reject(new Error('Unknown message type'))
        }
      },
    },
  }
}

export const setNewPin = (pin: string): SetNewPinCommand<ChangePinMessage> => {
  return {
    command: { cmd: Commands.setNewPin, value: pin },
    handler: {
      canHandle: [Messages.changePin],
      handle: (message, eventHandlers, { resolve }) => {
        const { handleChangePin } = eventHandlers
        handleChangePin && handleChangePin(message.success)
        return resolve(message)
      },
    },
  }
}
