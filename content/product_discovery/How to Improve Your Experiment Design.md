# How to Improve Your Experiment Design (And Build Trust in Your Product Experiments)

Originally published: August 9, 2017 by [Teresa Torres](https://www.producttalk.org/author/teresa/) | Last updated: November 8, 2023

![Continuous Discovery Habits book cover](https://www.producttalk.org/nitropack_static/DMQOfKcnMHdQNVRigsYYjOuRawguQXPa/assets/images/optimized/rev-7bad3d9/www.producttalk.org/wp-content/uploads/2021/05/book-email-signature.png)**Have you heard?** My new book [_Continuous Discovery Habits_](https://amzn.to/3hGkNYT) is now available. Get the product trio's guide to a structured and sustainable approach to continuous discovery.

![Level Up](https://www.producttalk.org/nitropack_static/DMQOfKcnMHdQNVRigsYYjOuRawguQXPa/assets/images/optimized/rev-7bad3d9/www.producttalk.org/wp-content/uploads/2016/01/level-up.png)

I’ve got a pet peeve to share with you.

If you’ve been following along with the growth of the [_Lean Startup_](http://amzn.to/2fmltoi) and other experimental methods, you’ve probably come across this hypothesis format:

* We believe \[this capability]
* Will result in \[this outcome]
* We will have confidence to proceed when \[we see these measurable signals]

If you aren’t familiar with this format, you can [learn more about it here](http://barryoreilly.com/2013/10/21/how-to-implement-hypothesis-driven-development/).

While this format is fast and easy to use, it isn’t enough to [ensure that your experiment designs are sound](https://www.producttalk.org/hypothesis-testing/). As a result, I often cringe when I hear that teams want to use it.

After talking with [Barry O’Reilly](http://barryoreilly.com/about/), the creator of this format, I realized that I often conflate a hypothesis format with experiment design. This is a fair criticism, so, let’s get clear on the difference.

Google tells me that a hypothesis is defined as follows:

> a supposition or proposed explanation made on the basis of limited evidence as a starting point for further investigation.

Product teams that adopt an experimental mindset start with hypotheses rather than assuming their beliefs are facts.

Experiment design, on the other hand, is the plan that a product team puts in place to test a specific hypothesis.

I like that the “We believe…” hypothesis format is simple enough that it encourages teams to commit their beliefs to paper and encourages them to treat their beliefs as suppositions rather than as assumed facts.

My concerns are that the format encourages teams to test the wrong things and it doesn’t require that teams get specific enough to lead to sound experiment design.

## Test Specific Assumptions, Not Ideas

The “We believe…” format does encourage teams to think about outcomes and particularly how to measure them. This is good. Too many teams still think producing features is adequate.

But I don’t like that this format starts with a statement about a capability. This keeps us fixated on our ideas, whereas we are better off identifying our key assumptions.

When we test an idea, we get stuck asking, “Will this feature work or not?” The best way to answer that question is to build it and test it. However, this requires that we spend the time to build the feature before we learn whether or not it will work.

Additionally, this is a “whether or not” question. [Chip and Dan Heath](http://heathbrothers.com/) remind us in [_Decisive_](http://amzn.to/2vfpRJI) that “whether or not” questions lead to too narrow of a framing. When we consider a series of [“whether or not” questions](https://www.producttalk.org/2013/07/stop-asking-whether-or-not-questions/)—should we build feature A, should we build feature B, and so on—we forget to account for opportunity cost.

Instead, we should frame our questions as “compare and contrast” decisions: “Which of these ideas look most promising?” We should design our experiments to answer this broader question. The best way to do that is to test the assumptions that need to be true for each idea to work.

Because ideas often share assumptions, this allows us to experiment quickly, ruling out sets of ideas when we find faulty assumptions. Additionally, as we build support for key assumptions, we can use those assumptions as building blocks to generate new ideas.

> Assumption testing is a faster path to success than idea testing. – [Tweet This](http://ctt.ec/N2cct)

As soon as we shift our focus to testing assumptions, the “We believe…” format falls apart. It’s rare that an outcome is dependent upon a single assumption, so the second and third parts of the hypothesis don’t hold up.

A more accurate format might be:

* We believe that \[Assumption A] and \[Assumption B]… and \[Assumption Z] are true
* Therefore we believe \[this capability]
* Will result in \[this outcome]
* We will have confidence to proceed when \[we see a measurable signal]

But again, it’s not the idea you should be testing. You should be testing each of the assumptions that need to be true for your idea to work. So we need a hypothesis format that works for each assumption.

> Test each of the assumptions that need to be true in order for your idea to work. – [Tweet This](http://ctt.ec/Aah02)

Let’s look at an example. Imagine you are working at [Facebook](https://www.facebook.com/) before they added the additional reaction options (e.g. love, sad, haha, sad, wow, angry). I suspect Facebook was inundated with “dislike button” requests, as I heard this complaint often.

Imagine you started with this modified hypothesis:

* We believe that

  * Assumption A: People either like or dislike a story.
  * Assumption B: People don’t want to click like on a story they dislike.
  * Assumption C: Some people who dislike a story would engage with the story if it was easier to do than having to write a comment.

* Therefore we believe that adding a dislike button

* Will result in more engagement on newsfeed stories

* We will have confidence to proceed when we see a 10% increase in newsfeed clicks.

Now imagine you do what most teams do and you test your new capability. You add a dislike button and you see a 5% increase in newsfeed clicks.

You didn’t see the engagement you expected, but you aren’t sure why. Is one of your assumptions false? Are they all true and they just didn’t have the effect size you expected? You have to do more research to answer these questions.

Now imagine you tested each of your assumptions individually. To test Assumption A, you could have a Facebook user review the stories in their newsfeed and share out loud their emotional reaction to each story. You’d uncover pretty quickly that Assumption A is not true. People have many different emotional responses to newsfeed stories.

Now I’m not saying that you wouldn’t have figured this out by running your capability test. You could easily run the same think-aloud study as we did in the assumption test after you built the dislike button. However, you will have learned what won’t work **after** you have already built the wrong capability.

The advantage of testing the individual assumptions is that you avoid building the wrong capability in the first place.

I don’t like that the “We believe…” format encourages us to test capabilities and not assumptions. However, this isn’t my only concern with the “We believe…” format.

## Align Around Your Experiment Design Before You Run Your Experiment

Have you ever run an experiment only to have key stakeholders or other team members argue with the results? I see it all the time.

You run an A/B test. Your variable loses to your control and the designer argues you tested with the wrong audience. Or an engineer argues that it will perform better once it’s optimized. Or the marketing team argues that even though it lost, it’s better for the brand. And so on.

We’ve all been there.

Here’s the thing. If you are going to ignore your experiment results, you might as well skip the experiment in the first place.

> If you are going to ignore your results, you might as well skip the experiment. – [Tweet This](http://ctt.ec/z4v68)

Now that doesn’t mean that these objections to the experiment design aren’t valid. They may be. But if the objections arise after the experiment was run, it’s difficult to separate valid concerns from [confirmation bias](https://www.producttalk.org/2013/08/confirmation-bias/).

Remember, as we invest in our ideas, we fall in love with them (we all do this, it’s a human bias called the [escalation of commitment](https://en.wikipedia.org/wiki/Escalation_of_commitment)). The more committed we are to an idea, the more likely we are to only see the data that confirms the idea rather than the disconfirming data, no matter how much disconfirming data there is. This is another human bias, commonly known as confirmation bias.

Our goal should be to surface these objections before we run the experiment. That way we can modify the design of our experiment to account for them.

Let’s return to our hypothesis:

* We believe that adding a dislike button
* Will result in more engagement on Facebook
* We will have confidence to proceed when we see clicks on news feed stories increase by 10%

This looks like a good hypothesis. It includes a clear outcome (i.e. more engagement) and it defines a clear threshold for a specific metric (i.e. 10% increase of clicks on news feed stories).

Remember, we tested this capability and we got a 5% increase in engagement, not a 10% increase. If we trust our experiment design, we need to conclude based on our data that our hypothesis is false as we didn’t clear our threshold.

But for most teams, this is not how they would interpret the results.

If you like the change, you’ll argue:

* We didn’t run the test for long enough.
* People didn’t have enough time to learn that the dislike button exists.
* The design was bad. People couldn’t find the dislike button.
* People hate all change for the first little while.
* Maybe the percentage we tested with are all optimists, liking everything.
* The news cycle that day was overly positive and skewed the results.
* 5% is pretty good, we can optimize our way to 10%.
* Any increase is good, let’s release it.

If you don’t like the change, you’ll argue:

* It didn’t work. We didn’t get to 10%.
* People don’t want to dislike things.
* Facebook is a happy place where people want to like things.
* Any increase is not good, because more options detract from the UI. We need to only add things that move the needle a lot.

And where do you end up? Exactly where you were before you ran the experiment—with a team who still can’t agree on what to do next.

Now this confusion isn’t necessarily because we didn’t frame our hypothesis well. It’s because we didn’t get alignment from our team on a sound experiment design before we ran the experiment. If everyone agreed that the experiment design was sound, we’d have no choice but to conclude based on our data that our hypothesis was false.

Now this isn’t a problem with the “We believe…” format per se, but I see many teams conflate a good hypothesis with a good experiment design, just like I did. They believe they have a sound hypothesis and therefore they conclude their experiment design is sound as well. However, this is not necessarily true.

## Invest the Time to Get Your Experiment Design Right

To ensure that your team won’t argue with your experimental results, take the time to define and get alignment around the following elements:

1. **The Assumption: **Be explicit about the assumption you are testing. Be specific.
2. **Experiment Design: **Describe the experiment stimulus and/or the data you plan to collect.
3. **Participants: **Define who is participating in the experiment. Be specific. All customers? Specific types of customers? And be sure to include how many.
4. **Key Metrics and Thresholds: **Be explicit about how you will evaluate the assumption. Define which metric(s) you will use and any relevant thresholds. For example, “increase engagement” is not specific enough. How do you measure engagement? “Increase clicks on newsfeed stories by 10%” is more specific and sets a clear threshold. For some types of metrics, it is also important to define when you will take the measurement. For example, if you are measuring open rates on an email, you’ll need to define how long you’ll give people to open the email (e.g. 3 days after it was sent).
5. **Have a clear rationale for why your experiment design/data collected will impact your metric.** Don’t over test. Be sure to have a strong theory for why you think this metric will move. Many teams get too enthusiastic about testing and test every variation without any rhyme or reason. Changing the button color from blue to red increased conversions so now they want to try green, purple, yellow, and orange. However, doing this will increase your chance of false positives and lead to many wasted experiments.
6. **Decide upfront how you will act on the data you collect.** Before you run your experiment, define what you will do if your assumption is supported, if it’s refuted, or in the case of a split test, if the results are flat. If the answer is the same in all three instances, skip your experiment and take action now. If you don’t know how you will use the data, you aren’t ready to run your experiment.

This list is more complex than the “We believe…” format and I don’t expect it to spread like wildfire. However, if you want to get more out of your experiments (and you want to build more trust amongst your team in your experimental results), defining (and getting alignment around) these elements upfront will help.

I’ll be sharing a one-page experiment design template with my mailing list members. If you want to snag a copy, use the form below to sign up.

Subscribers receive:

* A monthly article or video on product discovery/continuous innovation.
* A monthly newsletter with book recommendations and worthy reads from around the web.

## Get the Experiment Design Template

Subscribers also get weekly articles and a monthly newsletter.

![](https://www.producttalk.org/nitropack_static/DMQOfKcnMHdQNVRigsYYjOuRawguQXPa/assets/desktop/optimized/rev-7bad3d9/embed.filekitcdn.com/e/k2XxLUPLJZG7Fg5PHYXPUj/w12oKFZgJnfxMLiUbTb9sB)



First Name

Last Name

[Email Address](<mailto:Email Address>)

Job Title

Organization

Subscribe

We respect your privacy. Unsubscribe at any time.

A special thanks to [Barry O’Reilly](http://barryoreilly.com/about/) who read an early draft of this blog post. His feedback led to significant revisions that made this article better. Barry’s a thoughtful product leader. Be sure to [check out his blog](http://barryoreilly.com/blog/).