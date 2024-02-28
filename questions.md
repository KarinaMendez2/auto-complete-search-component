1. What is the difference between Component and PureComponent?
Give an example where it might break my app.

The main diff is how they decide to re-render. PureComponent does a shallow comparison on props and state, making it quicker because it doesn't re-render if those haven't changed. But, if you have complex data structures, it might miss some updates because it doesn't deeply compare objects (this can cause bugs or even crash the app). Imagine having an array of objects in your state; if you change an object inside that array without changing the array itself, PureComponent might not catch that change.

2. Context + ShouldComponentUpdate might be dangerous. Why is
that?

Mixing these can be tricky because shouldComponentUpdate might block updates from Context. If a context value changes, but shouldComponentUpdate returns false, the component won't re-render with the new context. It's like saying you want updates from the context but also blocking them at the door.

3. Describe 3 ways to pass information from a component to its
PARENT.

Callbacks: Child calls a function passed by the parent with the info as an argument.
State lifting: Move the state to the parent component and control the child from there.
Context: Use React context to provide data to parent (and other levels) without prop drilling.

4. Give 2 ways to prevent components from re-rendering.

shouldComponentUpdate: Return false to stop the re-render for class components.
React.memo for functional components: Wraps a component and stops re-rendering if props haven't changed.

5. What is a fragment and why do we need it? Give an example where it
might break my app.

They let you group a list of children without adding extra nodes to the DOM. It's great for keeping the DOM tree clean and efficient. If you overuse fragments in a place where the DOM structure matters (like in tables or using CSS that relies on a specific structure), things could look off because you expected a different DOM tree.

6. Give 3 examples of the HOC pattern.

withUser: Wraps a component to inject user info as props.
withLoading: Shows a loading spinner while data is fetching.
withErrorHandling: Wraps a component to handle errors gracefully.

7. What's the difference in handling exceptions in promises,
callbacks and async…await?

Promises: Use .catch() for errors.
Callbacks: Typically, the first argument is reserved for errors.
Async/await: Wrap in try/catch blocks. It's cleaner and more straightforward, making code look synchronous.

8. How many arguments does setState take and why is it async.

Takes 2 args. The first is the updater function or object, and the second is a callback that runs after the state is updated. It's async because React batches state updates for performance, meaning it doesn't happen immediately.

9. List the steps needed to migrate a Class to Function
Component.

Replace this.state with useState hooks.
Replace lifecycle methods with useEffect.
Replace this.props with props passed to the function.
Convert methods to functions inside or outside your component.

10. List a few ways styles can be used with components.

Inline styles using the style prop.
CSS Modules for scoped styles.
Styled-components for component-scoped CSS-in-JS.

11. How to render an HTML string coming from the server.

Use dangerouslySetInnerHTML={{ __html: yourHtmlString }} on an element, but be super careful with it to avoid XSS attacks. Always sanitize the HTML string if it's user-generated.
