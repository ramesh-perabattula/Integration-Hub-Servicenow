import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const privRestMsgCreate = Record({
    $id: Now.ID['priv_rest_msg_create'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message',
        target_type: 'sys_db_object',
        operation: 'create',
        status: 'allowed'
    }
});

export const privRestMsgWrite = Record({
    $id: Now.ID['priv_rest_msg_write'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message',
        target_type: 'sys_db_object',
        operation: 'write',
        status: 'allowed'
    }
});

export const privRestMsgRead = Record({
    $id: Now.ID['priv_rest_msg_read'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message',
        target_type: 'sys_db_object',
        operation: 'read',
        status: 'allowed'
    }
});

export const privRestMsgFnCreate = Record({
    $id: Now.ID['priv_rest_msg_fn_create'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message_fn',
        target_type: 'sys_db_object',
        operation: 'create',
        status: 'allowed'
    }
});

export const privRestMsgFnWrite = Record({
    $id: Now.ID['priv_rest_msg_fn_write'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message_fn',
        target_type: 'sys_db_object',
        operation: 'write',
        status: 'allowed'
    }
});

export const privRestMsgFnHeadersCreate = Record({
    $id: Now.ID['priv_rest_msg_fn_headers_create'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message_fn_headers',
        target_type: 'sys_db_object',
        operation: 'create',
        status: 'allowed'
    }
});

export const privRestMsgFnHeadersWrite = Record({
    $id: Now.ID['priv_rest_msg_fn_headers_write'],
    table: 'sys_scope_privilege',
    data: {
        target_name: 'sys_rest_message_fn_headers',
        target_type: 'sys_db_object',
        operation: 'write',
        status: 'allowed'
    }
});
