import {
  AccessRightsMessage,
  ApiLevelMessage,
  AuthMessage,
  BadStateMessage,
  CertificateMessage,
  ChangePinMessage,
  DisconnectMessage,
  EnterCanMessage,
  EnterNewPinMessage,
  EnterPinMessage,
  EnterPukMessage,
  InfoMessage,
  InitMessage,
  InsertCardMessage,
  InternalErrordMessage,
  InvalidMessage,
  Messages,
  ReaderListMessage,
  ReaderMessage,
  StatusMessage,
  UnkownCommandMessage,
} from './messageTypes'

export type MessageEvents = {
  [Messages.init]: (msg: InitMessage) => void
  [Messages.disconnect]: (msg: DisconnectMessage) => void
  [Messages.apiLevel]: (msg: ApiLevelMessage) => void
  [Messages.badState]: (msg: BadStateMessage) => void
  [Messages.info]: (msg: InfoMessage) => void
  [Messages.auth]: (msg: AuthMessage) => void
  [Messages.accessRights]: (msg: AccessRightsMessage) => void
  [Messages.enterPin]: (msg: EnterPinMessage) => void
  [Messages.enterPuk]: (msg: EnterPukMessage) => void
  [Messages.enterCan]: (msg: EnterCanMessage) => void
  [Messages.insertCard]: (msg: InsertCardMessage) => void
  [Messages.certificate]: (msg: CertificateMessage) => void
  [Messages.reader]: (msg: ReaderMessage) => void
  [Messages.enterNewPin]: (msg: EnterNewPinMessage) => void
  [Messages.changePin]: (msg: ChangePinMessage) => void
  [Messages.internalError]: (msg: InternalErrordMessage) => void
  [Messages.invalid]: (msg: InvalidMessage) => void
  [Messages.readerList]: (msg: ReaderListMessage) => void
  [Messages.status]: (msg: StatusMessage) => void
  [Messages.unknownCommand]: (msg: UnkownCommandMessage) => void
}
