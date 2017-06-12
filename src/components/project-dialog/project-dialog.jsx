import React, { Component, PropTypes } from 'react';
import './project-dialog.scss';

export default class ProjectDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      lang: 'ja',
      is_open: false
    }
  }
  close() {
		this.props.onClose();
    this.setState({ is_open: false });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      is_open: nextProps.isOpen
    })
  }
  render() {
    const state = this.state;
    const lang = state.lang;
    const collectionsReverse = [];
    return (
      <dialog className="mdl-dialog mdl-dialog--superwide js-collections-dialog atomicLabProjectsDialog" open={state.is_open}>
        <h4 className="atomicLabProjectsDialog-title mdl-dialog__title">{lang === 'ja' ? 'プロジェクトコレクション' : 'Projects collection'}</h4>
        <div className="mdl-dialog__content">
          <i className="atomicLabProjectsDialog-close material-icons" onClick={this.close.bind(this)}>close</i>
          <div className="atomicLabProjectsDialog-addProjectForm">
            <span className="atomicLabProjectsDialog-heading">
              {lang === 'ja' ? '現在のプロジェクトをコレクションに新規追加' : 'Add current project to my collections'}
            </span>
            <div className="mdl-textfield mdl-js-textfield">
              <input type="text" data-bind="projectName" className="mdl-textfield__input atomicLabProjectsDialog-input" placeholder="Project Name" />
              <button className="mdl-button mdl-button--raised mdl-button--accent" data-action="addToCollection">
                {lang === 'ja' ? '追加' : 'Add'}
              </button>
            </div>
          </div>
          <span className="atomicLabProjectsDialog-heading">
            {lang === 'ja' ? 'コレクション一覧' : 'My collections'}
          </span>
          <table className="atomicLabProjectsDialog-table _header">
            <tbody>
              <tr>
                <th className="atomicLabProjectsDialog-icon"></th>
                <th className="atomicLabProjectsDialog-name">Name</th>
                <th className="atomicLabProjectsDialog-url">URL</th>
                <th className="atomicLabProjectsDialog-share">Share</th>
                <th className="atomicLabProjectsDialog-icon"></th>
              </tr>
            </tbody>
          </table>
          <div className="atomicLabProjectsDialog-projectsContainer">
            <table className="atomicLabProjectsDialog-table _projects">
              <tbody>
                {collectionsReverse.map(item => {
                  <tr>
                    <td className="atomicLabProjectsDialog-icon">
                      <i className="material-icons">folder</i>
                    </td>
                    <td className="atomicLabProjectsDialog-name">
                      {item.onEdit ?
                        <div>
                          <input type="text" data-bind="collections.{i}[reversedIndex].projectName" style="width:100px;" />
                          <i className="material-icons atomicLabProjectsDialog-check" data-action="updateCollection({i})">check</i>
                        </div>
                        :
                        <span data-action="renameProject({i})" style="cursor:pointer">{projectName}</span>
                      }
                    </td>
                    <td className="atomicLabProjectsDialog-url">
                      <i id="updateProject{i}" className="material-icons atomicLabProjectsDialog-update">autorenew</i>
                      <div className="mdl-tooltip" data-mdl-for="updateProject{i}">Update this url
                                    <br />with current project contents.</div>
                      <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                        for="updateProject{i}">
                        <li disabled className="mdl-menu__item">Do you really want?</li>
                        <li className="mdl-menu__item">Cancel</li>
                        <li className="mdl-menu__item _carefully" data-action="updateProjectUrl({i})">UPDATE</li>
                      </ul>
                      <a href="{shortenedUrl}">{shortenedUrl}</a>
                    </td>
                    <td className="atomicLabProjectsDialog-share">
                      <i className="atomicLabProjectsDialog-shareIcon"><img src="./images/iconSlack-s.png" alt="" /></i>
                      <a href="https://twitter.com/intent/tweet?url={shortenedUrl}&hashtags=atomiclab" className="cssLabSocialBtn twitter" target="_blank">
                        <i className="atomicLabProjectsDialog-shareIcon"><img src="./images/iconTwitter-s.png" alt="" /></i>
                      </a>
                    </td>
                    <td className="atomicLabProjectsDialog-icon">
                      <i id="removeCollection{i}" className="atomicLabProjectsDialog-delete material-icons _danger" >delete</i>
                      <div className="mdl-tooltip" data-mdl-for="removeCollection{i}">Delete<br />from collection</div>
                      <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
                        for="removeCollection{i}">
                        <li disabled className="mdl-menu__item">Do you really want?</li>
                        <li className="mdl-menu__item">Cancel</li>
                        <li className="mdl-menu__item _danger" data-action="removeCollection({i})">DELETE</li>
                      </ul>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mdl-dialog__actions">
          <button className="mdl-button close" onClick={this.close.bind(this)}>{lang === 'ja' ? '閉じる' : 'Close'}</button>
        </div>
      </dialog>);
  }
}
