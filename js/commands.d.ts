import { AcceptCommand, CancelCommand, ChangePinCommand, DisconnectCommand, SetCanCommand, SetPinCommand, SetPukCommand, GetCertificateCommand, GetInfoCommand, Handler, HandlerDefinition, InitCommand, RunAuthCommand, SetAccessRightsCommand, SetNewPinCommand, GetStatusCommand, GetAPILevelCommand, SetAPILevelCommand, GetReaderCommand, GetReaderListCommand, GetAccessRightsCommand, SetCardCommand, InterruptCommand } from './commandTypes';
import { AccessRightsMessage, ApiLevelMessage, AuthMessage, BadStateMessage, CertificateMessage, ChangePinMessage, EnterCanMessage, EnterNewPinMessage, EnterPinMessage, EnterPukMessage, InfoMessage, InitMessage, DisconnectMessage, InsertCardMessage, ReaderListMessage, ReaderMessage, StatusMessage } from './messageTypes';
import { AccessRightsFields, ScannerMessages, SimulatorData } from './types';
export declare const insertCardHandler: HandlerDefinition<InsertCardMessage>;
export declare const readerHandler: HandlerDefinition<ReaderMessage>;
export declare const badStateHandler: HandlerDefinition<BadStateMessage>;
export declare const statusHandler: HandlerDefinition<StatusMessage>;
export declare const initSdkCmd: (callback: Handler<InitMessage>) => InitCommand<InitMessage>;
export declare const disconnectSdkCmd: (callback: Handler<DisconnectMessage>) => DisconnectCommand<DisconnectMessage>;
export declare const getInfoCmd: () => GetInfoCommand<InfoMessage>;
export declare const getStatusCmd: () => GetStatusCommand<StatusMessage>;
export declare const getAPILevelCmd: () => GetAPILevelCommand<ApiLevelMessage>;
export declare const setAPILevelCmd: (level: number) => SetAPILevelCommand<ApiLevelMessage>;
export declare const getReaderCmd: (name: string) => GetReaderCommand<ReaderMessage>;
export declare const getReaderListCmd: () => GetReaderListCommand<ReaderListMessage>;
export declare const runAuthCmd: (tcTokenURL: string, developerMode?: boolean, handleInterrupt?: boolean, status?: boolean, messages?: ScannerMessages) => RunAuthCommand<AccessRightsMessage, AccessRightsMessage | AuthMessage>;
export declare const changePinCmd: (handleInterrupt?: boolean, status?: boolean, messages?: ScannerMessages) => ChangePinCommand<ChangePinMessage, EnterPinMessage | EnterPukMessage | EnterCanMessage | ChangePinMessage>;
export declare const setPukCmd: (puk: string) => SetPukCommand<EnterPinMessage | EnterPukMessage, EnterPinMessage | EnterPukMessage | ChangePinMessage | AuthMessage>;
export declare const setCanCmd: (can: string) => SetCanCommand<EnterCanMessage, EnterPinMessage | EnterCanMessage | ChangePinMessage | AuthMessage>;
export declare const setPinCmd: (pin: string | undefined) => SetPinCommand<EnterPinMessage, EnterPinMessage | EnterPukMessage | EnterCanMessage | AuthMessage | EnterNewPinMessage | ChangePinMessage>;
export declare const acceptCmd: () => AcceptCommand<AuthMessage, EnterPinMessage | EnterPukMessage | EnterCanMessage | AuthMessage>;
export declare const getCertificateCmd: () => GetCertificateCommand<CertificateMessage>;
export declare const cancelFlowCmd: () => CancelCommand<AuthMessage, AuthMessage | ChangePinMessage>;
export declare const interruptFlowCmd: () => InterruptCommand;
export declare const getAccessRightsCmd: () => GetAccessRightsCommand<AccessRightsMessage>;
export declare const setAccessRightsCmd: (optionalFields: Array<AccessRightsFields>) => SetAccessRightsCommand<AccessRightsMessage>;
export declare const setCardCmd: (readerName: string, simulatorData?: SimulatorData) => SetCardCommand;
export declare const setNewPinCmd: (pin?: string) => SetNewPinCommand<ChangePinMessage, ChangePinMessage>;
