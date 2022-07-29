import ccObject from "../../abstract/ccObject";

class SearchMirror extends ccObject {
    constructor(props) {
        super(props)

        this.config = {
            ...this.config,
            contentContainer: this.config.baseStyleClass + ' ' + this.config.baseStyleClass + "-search__info",
            contentContainerSelector: "." + this.config.baseStyleClass + "-search__info",
        }

        this.state = {
            labels: this.saveSafePropertyProps(props, 'labels', [])
        }

        // console.log(this);
        // const content = this.getStringSearchMirror() // console.log(content); console.log(this);
    }

    update(type, string) {
        console.log('UPDATING MIRROR'); // console.log(type, string);

        this.state.labels[type].searchLabel = string // console.log(this.config.contentContainerSelector); // console.log($(this.config.contentContainerSelector)); // let string = this.getStringSearchMirror() // console.log(string);
        if (null != $(this.config.contentContainerSelector)) {
            $(this.config.contentContainerSelector).text(this.getStringSearchMirror())
        }
    }

    getStringSearchMirror(labels = this.state.labels) {
        return Object.keys(labels).reduce((prev, next) => {
            // console.log(labels[next].searchLabel);
            if (labels[next].searchLabel.length) {
                return prev + ' - ' + labels[next].searchLabel
            } else {
                return prev + ' - ' + labels[next].defaultFilterValue
            }            
        }, '').substring(' - '.length)
    }

    getHtmlJson() {
        const { tagName, filterAPIKey, filterTitleDesktop } = this.props
        const { baseStyleClass } = this.config
        const { labels } = this.state // console.log(baseStyleClass);
        
        return {
            attrs: {
                class: baseStyleClass + " " + baseStyleClass + "-search_wrap"
            },
            children: [
                {
                    tagName: "span",
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-search__info"
                    },
                    content: this.getStringSearchMirror() // '2 adults, Dec 2022, Mediterranean',
                },
                {
                    // tagName: "i",
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-search__action"
                    },
                    props: {
                        onclick: function (e) { $('.cc-fe_srp-search_display').toggleClass('open') }
                    }
                },
            ]
        }
        // return {}
    }
}

export default SearchMirror