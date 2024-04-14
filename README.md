# lsy-cli

###### lsy-cli is a personal scaffolding tool that can quickly create various types of project templates. And some useful features will be updated occasionally.
---
### Feature
- Quickly create various types of project templates
- Quickly create and configure SSH Keys
  - Automatically copy the public key to the clipboard, you only need to copy it to the hosting website O(∩_∩)O

---
### Template List
1. [Store4WX](https://github.com/Tencent/tdesign-miniprogram-starter-retail) 
2. [React-admin](https://github.com/HalseySpicy/Hooks-Admin)
3. [Vue-admin](https://github.com/vbenjs/vue-vben-admin)
4. [Shopify-theme-classic](https://github.com/lushuiyu/Super-Dawn)
---
### start
```javascript
npm i @lushuiyu/cli
// use -h or --help to get help
@lushuiyu/cli -h
// create a new project
@lushuiyu/cli create <project-name>
// create a new SSH key
@lushuiyu/cli sshkey
```