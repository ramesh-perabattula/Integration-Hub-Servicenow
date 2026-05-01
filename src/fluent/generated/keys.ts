import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    '0c0088dec3a0cf10a6d4e04bb001315c': {
                        table: 'sys_scope_privilege'
                        id: '0c0088dec3a0cf10a6d4e04bb001315c'
                        deleted: true
                    }
                    '180088dec3a0cf10a6d4e04bb00131c8': {
                        table: 'sys_scope_privilege'
                        id: '180088dec3a0cf10a6d4e04bb00131c8'
                        deleted: true
                    }
                    ai_assistant_helper: {
                        table: 'sys_script_include'
                        id: 'f0851da4b46c4840a440f0567618750b'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '0f06005d6c6b474798faca8aee7b5ab7'
                    }
                    br0: {
                        table: 'sys_script'
                        id: '2ddf76db3152484b97583d8a9928320f'
                    }
                    cc0088dec3a0cf10a6d4e04bb0013154: {
                        table: 'sys_scope_privilege'
                        id: 'cc0088dec3a0cf10a6d4e04bb0013154'
                        deleted: true
                    }
                    create_zoom_rest_br: {
                        table: 'sys_script'
                        id: '595e7c1994b544e0b384c1a8c984388c'
                        deleted: true
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: '6573ecce6b5a4d51ab31ab8346f516fb'
                    }
                    d40088dec3a0cf10a6d4e04bb00131c4: {
                        table: 'sys_scope_privilege'
                        id: 'd40088dec3a0cf10a6d4e04bb00131c4'
                        deleted: true
                    }
                    global_assistant_ui_script: {
                        table: 'sys_ui_script'
                        id: 'b9d5e07ed9354699ba75aadf52df3bfa'
                    }
                    global_integration_helper: {
                        table: 'sys_script_include'
                        id: '28c47bcbd23e40ffb8b0e66506e89bec'
                    }
                    integration_logs_module: {
                        table: 'sys_app_module'
                        id: '699a3901174a4442b17ac38a6d0e4695'
                    }
                    IntegrationHelper: {
                        table: 'sys_script_include'
                        id: 'a2e52f2eb1224c1b9d4552cbe99e9d19'
                    }
                    integrations_separator: {
                        table: 'sys_app_module'
                        id: 'db054545cd1245a99959bfa6c26d3e2c'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'de43988a7ef04bf3a29e55e7a980ac29'
                    }
                    priv_rest_msg_create: {
                        table: 'sys_scope_privilege'
                        id: 'fa184551c34344ecb35f326ac93a83d6'
                    }
                    priv_rest_msg_fn_create: {
                        table: 'sys_scope_privilege'
                        id: 'ff2b1086ef9b4be6897d25b73634d0ee'
                    }
                    priv_rest_msg_fn_headers_create: {
                        table: 'sys_scope_privilege'
                        id: 'a85b7c8ff2bb447299a7b307e8168cd5'
                    }
                    priv_rest_msg_fn_headers_write: {
                        table: 'sys_scope_privilege'
                        id: 'f96046e6418349c0896dc123c9d48344'
                    }
                    priv_rest_msg_fn_write: {
                        table: 'sys_scope_privilege'
                        id: 'e30d66041ff14eb58647167faa79e51b'
                    }
                    priv_rest_msg_read: {
                        table: 'sys_scope_privilege'
                        id: '6012f778f5e548a9871223b2d3785d41'
                    }
                    priv_rest_msg_write: {
                        table: 'sys_scope_privilege'
                        id: 'af2be4a0d9e84e6e90b3bb3b77fd08a7'
                    }
                    'src_server_business-rules_create-zoom-rest_js': {
                        table: 'sys_module'
                        id: '8f6c4c47253a495aafde31621a9e1806'
                    }
                    src_server_script_js: {
                        table: 'sys_module'
                        id: '2c4f46edf03a4af18e33a150bcb6c904'
                    }
                    'src_server_script-includes_AiAssistantHelper_js': {
                        table: 'sys_module'
                        id: '2b260c9b0da0421ca2ae88c0e851acde'
                    }
                    'src_server_script-includes_UniversalAuthManager_js': {
                        table: 'sys_module'
                        id: '4783ddb2032242d9acad313ac9148f81'
                    }
                    'src_server_script-includes_ZoomIntegrationHelper_js': {
                        table: 'sys_module'
                        id: '4038972d5c994919b5064da04dd52c62'
                    }
                    UniversalAuthManager: {
                        table: 'sys_script_include'
                        id: '1b315c71a40343d897c3df903deae70a'
                    }
                    zoom_hub_menu: {
                        table: 'sys_app_application'
                        id: 'a0c7c66fd6fb4ddfbd181c079afb1f41'
                    }
                    zoom_integration_list_module: {
                        table: 'sys_app_module'
                        id: '089692c390b64c6e8710ed77544ce91f'
                    }
                    'ZoomIntegrationForm.css': {
                        table: 'sys_ux_theme_asset'
                        id: '9f86d67c615b43449bb6395fa8ff0bd3'
                    }
                    ZoomIntegrationHelper: {
                        table: 'sys_script_include'
                        id: 'b7719f851bc74c21a31b5d83e360e8a2'
                        deleted: true
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '0136576e2aae431591e6afae1e12cbfd'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_response'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '02cf08ad6b3c4556bb8a84ea2c2c2d2e'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_client_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0359a53bfaa040198b2946559370cf42'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '04dc0a0e80c74a4d9ea1075943af7af2'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_auth_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '06e8338ec3640f10a6d4e04bb001318c'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            caption: 'NULL'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '07daded9d3794ab98e586150b6bfe798'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_api_key'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0801ccf9f68041f5b25acfbab455d7c4'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0ee8f302c3a0cf10a6d4e04bb001313c'
                        key: {
                            sys_ui_section: {
                                id: '06e8338ec3640f10a6d4e04bb001318c'
                                key: {
                                    name: 'x_1842120_hubby_u_zoom_integration'
                                    caption: 'NULL'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_methods'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0ee8f302c3a0cf10a6d4e04bb001313e'
                        key: {
                            sys_ui_section: {
                                id: '06e8338ec3640f10a6d4e04bb001318c'
                                key: {
                                    name: 'x_1842120_hubby_u_zoom_integration'
                                    caption: 'NULL'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_rest_message_name'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1067e8df743641deacd1d948ebb2c98a'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_integration_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '137934751ee64f77bd10227d26b86067'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '14ab55c00a4049c59c51295b0440f987'
                        key: {
                            name: 'x_1842120_hubby_zoom_integration_form.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '1a19fe25b46d414d97d3c76754647504'
                        key: {
                            category: 'x_1842120_hubby_u_zoom_integration'
                            prefix: 'ZI'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1ba4a44c1b274985a1f6dd230090422e'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2026e1500056499faa8deb05e41a4386'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_execution_time'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '274fc58970b0449f860133666b08529d'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_status'
                            value: 'inactive'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2f031dc3fca1493dbe8662efb991dfeb'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '33b7e0a5ef004e74bdfccd482616ebeb'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_phone_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '378e92b9f82a4e2b8aac7fd37c497f52'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_integration_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '37f921c8df274f3e8de817b713fc2ef9'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '397c7361cba1491cac507e3be0cecb21'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3ab56a048d804641a88ced51adec5c08'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3fb8af77e156420b94dd39c2f47395c8'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_error_message'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '40f391e7ccec49e3a9232449145f2ea3'
                        key: {
                            endpoint: 'x_1842120_hubby_zoom_integration_form.do'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '42e8f302c3a0cf10a6d4e04bb001313e'
                        key: {
                            sys_ui_section: {
                                id: '06e8338ec3640f10a6d4e04bb001318c'
                                key: {
                                    name: 'x_1842120_hubby_u_zoom_integration'
                                    caption: 'NULL'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_name'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '44709b6b5aac416a9217869186135d15'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_execution_time'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4471b09386c943c588518478da8b59ab'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_base_url'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '45b975e93c0d42d08573ebcf087533f2'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                            value: 'slack'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4d8fc75244a048008da802660bce3307'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_response'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4e8963b7e3064cb69b972b90c10ee53d'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_rest_message_name'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '4ecf9c4400134b89a01df1aeaaccb32a'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4ee8f302c3a0cf10a6d4e04bb0013140'
                        key: {
                            sys_ui_section: {
                                id: '06e8338ec3640f10a6d4e04bb001318c'
                                key: {
                                    name: 'x_1842120_hubby_u_zoom_integration'
                                    caption: 'NULL'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_client_secret'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4ff1a2d9f1754d09b3afcd5781215987'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_status'
                            value: 'active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '543ac45f77e94528a48c2a14b2fdfe53'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_phone_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '59fe122bf81b40b6bf482066020e9b18'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_methods'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5c5261a445c5464899c55b345c27e76b'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_account_sid'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '5f17ee5daed942c9b7f7f61c7ca1f1b9'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '603efea1e6dd43e7972ebf076647683a'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                            value: 'jira'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '65f4b6306f6748a4b72b6fb5301a8c2a'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_status'
                            value: 'success'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '667a819456a14c468708935917673c70'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_integration_type'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '6e6993f4ab1043a094e75a4bb103e41d'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6f9805f757634e39a427ec4c31551656'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_base_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '7227be0f825b40d7aa93b3582b43b38b'
                        key: {
                            application_file: '885c44b9325d40a8a91e82f081b6efdf'
                            source_artifact: '14ab55c00a4049c59c51295b0440f987'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '72c34118d5f4441e9449c92ae6d88b2c'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_api_key'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '75b1158eb24e475f9b08a8cb5287a0ad'
                        key: {
                            category: 'x_1842120_hubby_u_integration_logs'
                            prefix: 'LOG'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76061d9bffbc40b2b064c642d00296ae'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_rest_message_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7ea8edcbd60c4f97af6619bad475cb52'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_project_key'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7f854388996f404da46f2ee7095c734f'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_client_secret'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '82e8f302c3a0cf10a6d4e04bb0013140'
                        key: {
                            sys_ui_section: {
                                id: '06e8338ec3640f10a6d4e04bb001318c'
                                key: {
                                    name: 'x_1842120_hubby_u_zoom_integration'
                                    caption: 'NULL'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_status'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '861f4b4cc01b4e4797fbd012e102efa5'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_client_id'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '885c44b9325d40a8a91e82f081b6efdf'
                        key: {
                            name: 'x_1842120_hubby/zoom-integration-form'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '890c9bbbf8c343c2b74d146a4b189ae8'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '895156bbd9f642ecb24fe753b756b87c'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8a968d56810e45648ef8b15b69987ace'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_request'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8c1085d377cb4b3ea8947f627f8948cf'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_integration_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '928202ee4f9346ab9649925dafc9ce6b'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_request'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '94090711cfbe4423aa5bc9e03e5a0cc2'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '94a48449bb064904bd02e835ba1dd67b'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_status'
                            value: 'failure'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9abd2587f9f64ce0a92c09c373e6384b'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_client_secret'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a05b98b7bf4b4d86a415d4ec7916cd4d'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a14e9ae8d02f4057878d5c6ac93411a4'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_action'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a2bd42480ae34664828f94f773489492'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_project_key'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a99a2bacc858409eade27e19fac32ed0'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_default_channel'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'af542faff2ec4aa3b56040f0b44b3e40'
                        key: {
                            name: 'x_1842120_hubby/zoom-integration-form.js.map'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b55b3caebdfc4cc0b1aac5ec70141baf'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                            value: 'twilio'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'b9b3a6cd5ab0431d88f3a5567d7cb7aa'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bcc2fb4b5ee147eb9d0c35536fae37f1'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_default_channel'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'be0efe53ce4d4f31875adf065aa25711'
                        key: {
                            application_file: '40f391e7ccec49e3a9232449145f2ea3'
                            source_artifact: '14ab55c00a4049c59c51295b0440f987'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3fad30dcb2141b58641d97d4e079bfb'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c6e8f302c3a0cf10a6d4e04bb001313f'
                        key: {
                            sys_ui_section: {
                                id: '06e8338ec3640f10a6d4e04bb001318c'
                                key: {
                                    name: 'x_1842120_hubby_u_zoom_integration'
                                    caption: 'NULL'
                                    view: 'Default view'
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_client_id'
                            position: '3'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'c8ec86cff2cd4ab48f1020ff3c303042'
                        key: {
                            application_file: 'af542faff2ec4aa3b56040f0b44b3e40'
                            source_artifact: '14ab55c00a4049c59c51295b0440f987'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ccd61790ebe64a76b952e8a4df80ad97'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_auth_token'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cebcd9a610e54afab55f48f348242ba4'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                            value: 'postman'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd3aef07e284b435385471320312c7e3f'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_error_message'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7099de4b0874fec9dd5725ae9a9e831'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'u_action'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dd9fa895b011445eb5ef3636c41568e2'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_methods'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e8f3145c1d044bf3955e5279524de45b'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_account_sid'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ecf75e282892426f841dc9954cc33e13'
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f6152cd922ab44308d4579c70eda2f3d'
                        deleted: true
                        key: {
                            name: 'x_1842120_hubby_u_zoom_integration'
                            element: 'u_integration_type'
                            value: 'zoom'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa0a4dfbeba54367b0d61a1be4c1c9e0'
                        key: {
                            name: 'x_1842120_hubby_u_integration_logs'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
