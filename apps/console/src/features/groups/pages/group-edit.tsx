/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {AppConstants, history} from "../../core";
import { getGroupById } from "../api";
import { EditGroup } from "../components";
import { GroupConstants } from "../constants";
import { GroupsInterface } from "../models";

const GroupEditPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();

    const [ roleId, setGroupId ] = useState<string>(undefined);
    const [ group, setGroup ] = useState<GroupsInterface>();
    const [ isGroupDetailsRequestLoading, setIsGroupDetailsRequestLoading ] = useState<boolean>(false);

    const getGroupDetails = (roleId: string ): void => {
        setIsGroupDetailsRequestLoading(true);

        getGroupById(roleId)
            .then(response => {
                if (response.status === 200) {
                    setGroup(response.data);
                }
            }).catch(() => {
            // TODO: handle error
        })
            .finally(() => {
                setIsGroupDetailsRequestLoading(false);
            })
    };

    const onGroupUpdate = (): void => {
        getGroupDetails(roleId);
    };

    /**
     * Get Group data from URL id
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const roleId = path[ path.length - 1 ];

        setGroupId(roleId);
        getGroupDetails(roleId);
    }, []);

    const handleBackButtonClick = () => {
        history.push(AppConstants.PATHS.get("GROUPS"));
    };

    return (
        <PageLayout
            isLoading={ isGroupDetailsRequestLoading }
            title={
                group && group.displayName ?
                    group.displayName :
                    t("adminPortal:pages.rolesEdit.title")
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("adminPortal:pages.rolesEdit.backButton", { type: "groups" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditGroup
                group={ group }
                groupId={ roleId }
                onGroupUpdate={ onGroupUpdate }
            />
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GroupEditPage;