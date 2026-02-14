import QtCore
import QtQuick
import QtQuick.Controls
import QtQuick.Controls.Basic
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects
import llm
import chatlistmodel
import download
import modellist
import network
import gpt4all
import mysettings

Rectangle {
    id: homeView

    Theme {
        id: theme
    }

    color: theme.viewBackground
    signal chatViewRequested()
    signal localDocsViewRequested()
    signal settingsViewRequested(int page)
    signal addModelViewRequested()
    signal modelsViewRequested()
    property bool shouldShowFirstStart: false

    ListModel {
        id: heroHighlightsModel
        ListElement { label: qsTr("Privacy-first") }
        ListElement { label: qsTr("Model marketplace") }
        ListElement { label: qsTr("Offline friendly") }
    }

    ListModel {
        id: workspaceActionsModel
        ListElement {
            title: qsTr("Start Chatting")
            description: qsTr("Chat with any LLM")
            icon: "qrc:/gpt4all/icons/chat.svg"
            action: "chat"
        }
        ListElement {
            title: qsTr("LocalDocs")
            description: qsTr("Chat with your local files")
            icon: "qrc:/gpt4all/icons/db.svg"
            action: "localDocs"
        }
        ListElement {
            title: qsTr("Find Models")
            description: qsTr("Explore and download models")
            icon: "qrc:/gpt4all/icons/models.svg"
            action: "findModels"
        }
        ListElement {
            title: qsTr("Installed Models")
            description: qsTr("Review your downloaded models")
            icon: "qrc:/gpt4all/icons/stack.svg"
            action: "models"
        }
        ListElement {
            title: qsTr("Application Settings")
            description: qsTr("Customize your workspace")
            icon: "qrc:/gpt4all/icons/settings.svg"
            action: "settings"
            page: 0
        }
        ListElement {
            title: qsTr("Model Preferences")
            description: qsTr("Tune inference defaults")
            icon: "qrc:/gpt4all/icons/edit.svg"
            action: "settings"
            page: 1
        }
        ListElement {
            title: qsTr("LocalDocs Setup")
            description: qsTr("Manage indexing and sources")
            icon: "qrc:/gpt4all/icons/local-docs.svg"
            action: "settings"
            page: 2
        }
    }

    ListModel {
        id: exploreActionsModel
        ListElement {
            title: qsTr("Documentation")
            description: qsTr("Learn tips and best practices")
            icon: "qrc:/gpt4all/icons/webpage.svg"
            url: "https://docs.gpt4all.io/"
        }
        ListElement {
            title: qsTr("Release Notes")
            description: qsTr("Catch up on the latest updates")
            icon: "qrc:/gpt4all/icons/changelog.svg"
            url: "https://github.com/nomic-ai/gpt4all/releases"
        }
        ListElement {
            title: qsTr("Community Discord")
            description: qsTr("Get help from other users")
            icon: "qrc:/gpt4all/icons/discord.svg"
            url: "https://discord.gg/4M2QFmTt2k"
        }
        ListElement {
            title: qsTr("GitHub")
            description: qsTr("Explore the project roadmap")
            icon: "qrc:/gpt4all/icons/github.svg"
            url: "https://github.com/nomic-ai/gpt4all"
        }
        ListElement {
            title: qsTr("Knowledge Base")
            description: qsTr("Read troubleshooting guides")
            icon: "qrc:/gpt4all/icons/info.svg"
            url: "https://docs.gpt4all.io/gpt4all_desktop/faq.html"
        }
        ListElement {
            title: qsTr("Community Blog")
            description: qsTr("See how others build with GPT4All")
            icon: "qrc:/gpt4all/icons/globe.svg"
            url: "https://www.nomic.ai/blog"
        }
    }

    ColumnLayout {
        id: mainArea
        anchors.fill: parent
        anchors.margins: 30
        spacing: 30

        ColumnLayout {
            id: contentColumn
            Layout.fillWidth: true
            Layout.maximumWidth: 1530
            Layout.alignment: Qt.AlignHCenter
            Layout.topMargin: 20
            spacing: 30

            Rectangle {
                id: heroCard
                Layout.fillWidth: true
                radius: 18
                border.width: 1
                border.color: theme.controlBorder
                color: theme.controlBackground
                layer.enabled: true
                layer.effect: DropShadow {
                    horizontalOffset: 0
                    verticalOffset: 12
                    radius: 24
                    samples: 32
                    color: Qt.rgba(0, 0, 0, 0.18)
                }
                readonly property bool useWideLayout: width > 880

                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 30
                    spacing: 28

                    RowLayout {
                        Layout.fillWidth: true
                        Layout.alignment: Qt.AlignTop
                        spacing: heroCard.useWideLayout ? 40 : 24

                        ColumnLayout {
                            id: heroTextColumn
                            Layout.fillWidth: !heroCard.useWideLayout
                            Layout.preferredWidth: heroCard.useWideLayout ? Math.min(heroCard.width * 0.42, 420) : heroCard.width
                            Layout.alignment: heroCard.useWideLayout ? Qt.AlignLeft | Qt.AlignTop : Qt.AlignHCenter
                            spacing: 14

                            Text {
                                id: welcome
                                Layout.fillWidth: true
                                text: qsTr("Welcome to GPT4All")
                                font.pixelSize: theme.fontSizeBannerLarge
                                font.bold: true
                                wrapMode: Text.WordWrap
                                color: theme.titleTextColor
                            }

                            Text {
                                Layout.fillWidth: true
                                text: qsTr("The privacy-first workspace for chatting with local and remote LLMs.")
                                font.pixelSize: theme.fontSizeLarge
                                wrapMode: Text.WordWrap
                                color: theme.titleInfoTextColor
                            }

                            Flow {
                                Layout.fillWidth: true
                                spacing: 10
                                Repeater {
                                    model: heroHighlightsModel
                                    delegate: Rectangle {
                                        radius: 12
                                        color: theme.welcomeButtonBackground
                                        border.width: 1
                                        border.color: theme.welcomeButtonBorder
                                        implicitHeight: highlightLabel.implicitHeight + 8
                                        implicitWidth: highlightLabel.implicitWidth + 24

                                        Text {
                                            id: highlightLabel
                                            anchors.centerIn: parent
                                            text: model.label
                                            color: theme.welcomeButtonText
                                            font.pixelSize: theme.fontSizeSmall
                                            font.bold: true
                                        }
                                    }
                                }
                            }

                            MyButton {
                                id: startChat
                                visible: shouldShowFirstStart
                                Layout.alignment: heroCard.useWideLayout ? Qt.AlignLeft : Qt.AlignHCenter
                                text: qsTr("Start chatting")
                                onClicked: {
                                    chatViewRequested()
                                }
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            Layout.alignment: Qt.AlignTop
                            spacing: 16
                            visible: !startChat.visible

                            Text {
                                Layout.fillWidth: true
                                text: qsTr("Workspace apps")
                                font.pixelSize: theme.fontSizeLarge
                                font.bold: true
                                color: theme.titleTextColor
                            }

                            Text {
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                                text: qsTr("Jump straight into common flows or fine-tune your setup.")
                                font.pixelSize: theme.fontSizeSmall
                                color: theme.titleInfoTextColor
                            }

                            GridLayout {
                                id: workspaceGrid
                                Layout.fillWidth: true
                                columnSpacing: 15
                                rowSpacing: 15
                                readonly property int idealButtonWidth: 150 + 180 * theme.fontScale
                                readonly property int maxColumns: heroCard.useWideLayout ? 3 : 2
                                readonly property int computedColumns: {
                                    const available = heroCard.width - (heroCard.useWideLayout ? heroTextColumn.Layout.preferredWidth + 60 : 60)
                                    const spacingWidth = columnSpacing
                                    const columns = Math.max(1, Math.floor((available + spacingWidth) / (idealButtonWidth + spacingWidth)))
                                    return Math.max(1, Math.min(maxColumns, columns))
                                }
                                columns: computedColumns

                                Repeater {
                                    model: workspaceActionsModel
                                    delegate: MyWelcomeButton {
                                        Layout.fillWidth: true
                                        Layout.maximumWidth: workspaceGrid.idealButtonWidth
                                        Layout.preferredHeight: 48 + 90 * theme.fontScale
                                        text: model.title
                                        description: model.description
                                        imageSource: model.icon
                                        onClicked: {
                                            homeView.handleQuickAction(model.action, model.page, model.url)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Rectangle {
                id: exploreCard
                Layout.fillWidth: true
                radius: 16
                border.width: 1
                border.color: theme.controlBorder
                color: theme.conversationBackground

                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 24
                    spacing: 18

                    Text {
                        Layout.fillWidth: true
                        text: qsTr("Explore more experiences")
                        font.pixelSize: theme.fontSizeLarge
                        font.bold: true
                        color: theme.titleTextColor
                    }

                    Text {
                        Layout.fillWidth: true
                        wrapMode: Text.WordWrap
                        text: qsTr("Browse resources, stay informed, and connect with the GPT4All community.")
                        font.pixelSize: theme.fontSizeSmall
                        color: theme.titleInfoTextColor
                    }

                    GridLayout {
                        id: exploreGrid
                        Layout.fillWidth: true
                        columnSpacing: 15
                        rowSpacing: 15
                        readonly property int idealButtonWidth: 150 + 160 * theme.fontScale
                        readonly property int computedColumns: {
                            const totalWidth = exploreCard.width - 48
                            const spacingWidth = columnSpacing
                            const maxColumns = totalWidth >= idealButtonWidth * 4 + spacingWidth * 3 ? 4 : (totalWidth >= idealButtonWidth * 3 + spacingWidth * 2 ? 3 : (totalWidth >= idealButtonWidth * 2 + spacingWidth ? 2 : 1))
                            return maxColumns
                        }
                        columns: computedColumns

                        Repeater {
                            model: exploreActionsModel
                            delegate: MyWelcomeButton {
                                Layout.fillWidth: true
                                Layout.maximumWidth: exploreGrid.idealButtonWidth
                                Layout.preferredHeight: 48 + 90 * theme.fontScale
                                text: model.title
                                description: model.description
                                imageSource: model.icon
                                onClicked: {
                                    homeView.handleQuickAction(model.action, model.page, model.url)
                                }
                            }
                        }
                    }
                }
            }

            ColumnLayout {
                id: newsSection
                visible: !startChat.visible && Download.latestNews !== ""
                Layout.fillWidth: true
                spacing: 12

                Text {
                    Layout.fillWidth: true
                    text: qsTr("Latest from GPT4All")
                    font.pixelSize: theme.fontSizeLarge
                    font.bold: true
                    color: theme.titleTextColor
                }

                Rectangle {
                    id: newsCard
                    Layout.fillWidth: true
                    Layout.minimumHeight: 160
                    radius: 12
                    border.width: 1
                    border.color: theme.controlBorder
                    color: "transparent"
                    clip: true

                    Rectangle {
                        anchors.fill: parent
                        color: theme.conversationBackground
                    }

                    RowLayout {
                        anchors.fill: parent
                        spacing: 0

                        Rectangle {
                            width: heroCard.useWideLayout ? 110 : 88
                            color: "transparent"

                            Image {
                                id: newsImg
                                anchors.centerIn: parent
                                sourceSize: Qt.size(56, 56)
                                mipmap: true
                                visible: false
                                source: "qrc:/gpt4all/icons/gpt4all_transparent.svg"
                            }

                            ColorOverlay {
                                anchors.fill: newsImg
                                source: newsImg
                                color: theme.styledTextColor
                            }
                        }

                        Item {
                            id: myItem
                            Layout.fillWidth: true
                            Layout.fillHeight: true

                            ScrollView {
                                id: newsScroll
                                anchors.fill: parent
                                clip: true
                                ScrollBar.vertical.policy: ScrollBar.AsNeeded
                                ScrollBar.horizontal.policy: ScrollBar.AlwaysOff

                                Text {
                                    id: textAreaNews
                                    width: myItem.width
                                    padding: 24
                                    color: theme.styledTextColor
                                    font.pixelSize: theme.fontSizeLarger
                                    textFormat: TextEdit.MarkdownText
                                    wrapMode: Text.WordWrap
                                    text: Download.latestNews
                                    focus: false
                                    Accessible.role: Accessible.Paragraph
                                    Accessible.name: qsTr("Latest news")
                                    Accessible.description: qsTr("Latest news from GPT4All")
                                    onLinkActivated: function(link) {
                                        Qt.openUrlExternally(link);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        Rectangle {
            id: linkBar
            Layout.fillWidth: true
            Layout.maximumWidth: 1530
            Layout.alignment: Qt.AlignHCenter | Qt.AlignBottom
            border.width: 1
            border.color: theme.dividerColor
            radius: 6
            z: 200
            height: 30
            color: theme.conversationBackground

            RowLayout {
                anchors.fill: parent
                spacing: 0
                RowLayout {
                    Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter
                    spacing: 4

                    MyFancyLink {
                        text: qsTr("Release Notes")
                        imageSource: "qrc:/gpt4all/icons/notes.svg"
                        onClicked: { Qt.openUrlExternally("https://github.com/nomic-ai/gpt4all/releases") }
                    }

                    MyFancyLink {
                        text: qsTr("Documentation")
                        imageSource: "qrc:/gpt4all/icons/info.svg"
                        onClicked: { Qt.openUrlExternally("https://docs.gpt4all.io/") }
                    }

                    MyFancyLink {
                        text: qsTr("Discord")
                        imageSource: "qrc:/gpt4all/icons/discord.svg"
                        onClicked: { Qt.openUrlExternally("https://discord.gg/4M2QFmTt2k") }
                    }

                    MyFancyLink {
                        text: qsTr("X (Twitter)")
                        imageSource: "qrc:/gpt4all/icons/twitter.svg"
                        onClicked: { Qt.openUrlExternally("https://twitter.com/nomic_ai") }
                    }

                    MyFancyLink {
                        text: qsTr("Github")
                        imageSource: "qrc:/gpt4all/icons/github.svg"
                        onClicked: { Qt.openUrlExternally("https://github.com/nomic-ai/gpt4all") }
                    }
                }

                RowLayout {
                    Layout.alignment: Qt.AlignRight | Qt.AlignVCenter
                    spacing: 40

                    MyFancyLink {
                        text: qsTr("nomic.ai")
                        imageSource: "qrc:/gpt4all/icons/globe.svg"
                        onClicked: { Qt.openUrlExternally("https://www.nomic.ai/gpt4all") }
                        rightPadding: 15
                    }
                }
            }
        }
    }

    Rectangle {
        anchors.top: heroCard.top
        anchors.right: heroCard.right
        anchors.topMargin: -15
        anchors.rightMargin: -15
        border.width: 1
        border.color: theme.dividerColor
        radius: 6
        z: 200
        height: 30
        color: theme.conversationBackground
        width: subscribeLink.width
        RowLayout {
            anchors.centerIn: parent
            MyFancyLink {
                id: subscribeLink
                Layout.alignment: Qt.AlignCenter
                text: qsTr("Subscribe to Newsletter")
                imageSource: "qrc:/gpt4all/icons/email.svg"
                onClicked: { Qt.openUrlExternally("https://nomic.ai/gpt4all/#newsletter-form") }
            }
        }
    }

    function handleQuickAction(action, page, url) {
        switch (action) {
        case "chat":
            chatViewRequested()
            break
        case "localDocs":
            localDocsViewRequested()
            break
        case "findModels":
            addModelViewRequested()
            break
        case "models":
            modelsViewRequested()
            break
        case "settings": {
            const normalizedPage = (typeof page === "number" && isFinite(page))
                    ? Math.max(0, Math.floor(page))
                    : 0
            settingsViewRequested(normalizedPage)
            break
        }
        case "docs":
        case "community":
            if (url)
                Qt.openUrlExternally(url)
            break
        default:
            if (url)
                Qt.openUrlExternally(url)
        }
    }
}
