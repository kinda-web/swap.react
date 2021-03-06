import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import helpers, { constants } from 'helpers'
import actions from 'redux/actions'
import Link from 'sw-valuelink'
import { connect } from 'redaction'
import config from 'app-config'

import cssModules from 'react-css-modules'

import styles from '../Styles/default.scss'

import { BigNumber } from 'bignumber.js'
import Modal from 'components/modal/Modal/Modal'
import FieldLabel from 'components/forms/FieldLabel/FieldLabel'
import Input from 'components/forms/Input/Input'
import Button from 'components/controls/Button/Button'
import Tooltip from 'components/ui/Tooltip/Tooltip'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { isMobile } from 'react-device-detect'

import typeforce from 'swap.app/util/typeforce'
// import { isCoinAddress } from 'swap.app/util/typeforce'
import minAmount from 'helpers/constants/minAmount'
import { inputReplaceCommaWithDot } from 'helpers/domUtils'
import links from 'helpers/links'
import SwapApp from 'swap.app'
import CopyToClipboard from 'react-copy-to-clipboard'



@injectIntl
@connect(
  ({
    user: { btcMultisigUserData },
  }) => ({
    btcData: btcMultisigUserData,
  })
)
@cssModules(styles, { allowMultiple: true })
export default class MultisignJoinLink extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.object,
  }

  constructor() {
    super()


    this.state = {
      joinLink: ''
    }
  }

  componentDidMount() {
    const publicKey = this.props.btcData.publicKey.toString('hex')

    this.setState({
      joinLink: `${location.origin}/#${links.multisign}/btc/join/${publicKey}/${SwapApp.shared().services.room.peer}`
    })
  }

  handleFinish = async () => {
    const { name } = this.props
    const { isLinkCopied } = this.state

    if (!isLinkCopied) return

    actions.modals.close(name)

    if (this.props.data.callback) {
      this.props.data.callback()
    }
  }

  handleCopyLink = () => {
    this.setState({
      isLinkCopied: true,
    })
  }

  render() {
    //const { phone, step, error, smsCode, smsConfirmed, isShipped } = this.state
    const { name, intl } = this.props
    const { joinLink, isLinkCopied } = this.state

    const title = defineMessages({
      multiSignJoinLink: {
        id: 'multiSignJoinLink',
        defaultMessage: `Создание BTC-Multisign кошелька`,
      },
    })

    return (
      <Modal name={name} title={`${intl.formatMessage(title.multiSignJoinLink)}`}>
        <Fragment>
          <CopyToClipboard
            text={joinLink}
            onCopy={this.handleCopyLink}
          >
            <div>
              <div styleName="highLevel">
                <FieldLabel>
                  <span style={{ fontSize: '16px' }}>
                    <FormattedMessage id="multiSignJoinLinkMessage" defaultMessage="Отправьте эту ссылку второму владельцу кошелька" />
                  </span>
                </FieldLabel>
                <FieldLabel>
                  <span style={{ fontSize: '14px', maxWidth: '600px', wordBreak: 'break-all', display: 'block' }}>
                    {joinLink}
                  </span>
                </FieldLabel>
              </div>
              <Button
                styleName="button"
                brand
                onClick={this.handleFinish}
                fullWidth
              >
                { isLinkCopied ?
                  <FormattedMessage id="multiSignJoinLinkCopied" defaultMessage="Ready. Link copied to clipboard" />
                  :
                  <FormattedMessage id="multiSignJoinLinkCopy" defaultMessage="Copy to clipboard" />
                }
              </Button>
            </div>
          </CopyToClipboard>
        </Fragment>
      </Modal>
    )
  }
}
