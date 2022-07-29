// import ccObject from "../../abstract/ccObject"

// class Error extends ccObject {
//     constructor(props) {
//         super(props)

//         this.props = {
//             ...this.props,
//             index: this.saveSafePropertyProps(props, 'index', 0), // OPT CODE // COUNTER
//             type: this.saveSafePropertyProps(props, 'type', ''),
//             label: this.saveSafePropertyProps(props, 'label', ''),
//             // optCode: this.saveSafePropertyProps(props, 'optCode', ''),
//         }

//         this.config = {
//             ...this.config,
//             baseNodeSelector: '#' + this.config.baseStyleClass + '-input-error-' + index + '-' + type
//         }
//     }

//     getHtmlJson() {
//         const {baseStyleClass} = this.config
//         const {index, type, label} = this.props

//         return {
//             attrs: {
//                 id: this.config.baseStyleClass + '-input-error-' + index + '-' + type,
//                 class: baseStyleClass + '-input-error'
//             },
//             content: label 
//         }
//     }

//     getDomElement() {
//         return this.paint(this.getHtmlJson())
//     }

//     remove() {
//         $(this.config.baseNodeSelector).remove()
//     }
// }

// export default Error